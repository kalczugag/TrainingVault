import express from "express";
import zlib from "zlib";
import AdmZip from "adm-zip";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { parseFitFile, safeFloat, safeNum } from "../../utils/helpers";
import { updateTop3 } from "../../config/garmin";
import { recalculatePMC } from "../../config/pmcService";
import { ActivityModel } from "../../models/Activity";
import { ActivityStreamModel } from "../../models/ActivityStream";
import { UserStatModel } from "../../models/UserStat";
import { PlannedWorkoutModel } from "../../models/PlannedWorkout";
import type { User } from "../../types/User";

export const uploadFitActivity = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res
                .status(400)
                .json(errorResponse(null, "No files uploaded", 400));
        }

        const fitBuffers: { buffer: Buffer; fileName: string }[] = [];

        for (const file of files) {
            const fileName = file.originalname.toLowerCase();

            try {
                if (fileName.endsWith(".zip")) {
                    const zip = new AdmZip(file.buffer);
                    const zipEntries = zip.getEntries();

                    const fitEntries = zipEntries.filter((entry) =>
                        entry.entryName.toLowerCase().endsWith(".fit"),
                    );

                    for (const entry of fitEntries) {
                        fitBuffers.push({
                            buffer: entry.getData(),
                            fileName: entry.entryName,
                        });
                    }
                } else if (fileName.endsWith(".gz")) {
                    const unzipped = zlib.gunzipSync(file.buffer);
                    fitBuffers.push({
                        buffer: unzipped,
                        fileName: file.originalname,
                    });
                } else if (fileName.endsWith(".fit")) {
                    fitBuffers.push({
                        buffer: file.buffer,
                        fileName: file.originalname,
                    });
                }
            } catch (err: any) {
                console.error(
                    `Error extracting file ${fileName}:`,
                    err.message,
                );
            }
        }

        if (fitBuffers.length === 0) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        null,
                        "No valid .fit files found in the upload",
                        400,
                    ),
                );
        }

        const results = { successful: 0, failed: 0, errors: [] as string[] };
        let pmcNeedsRecalc = false;
        let oldestActivityDate = new Date();

        const populatedUser = await (req.user as any).populate(
            "thresholdHistory",
        );
        let userFtp = 251;
        if (
            populatedUser &&
            populatedUser.thresholdHistory &&
            populatedUser.thresholdHistory.length > 0
        ) {
            const history = populatedUser.thresholdHistory;
            userFtp = history[history.length - 1].ftp || 250;
        }

        let userStats = await UserStatModel.findOne({ athleteId: userId });
        if (!userStats) {
            userStats = new UserStatModel({ athleteId: userId });
        }
        let isModified = false;

        for (const item of fitBuffers) {
            try {
                const parsedData = await parseFitFile(item.buffer);

                if (
                    !parsedData ||
                    !parsedData.sessions ||
                    parsedData.sessions.length === 0
                ) {
                    throw new Error("Invalid or empty FIT file");
                }

                const session = parsedData.sessions[0];
                const activityDate = new Date(session.start_time);
                const records = parsedData.records || [];

                if (activityDate < oldestActivityDate) {
                    oldestActivityDate = activityDate;
                }

                const powerCurve = {
                    p1s: 0,
                    p5s: 0,
                    p10s: 0,
                    p20s: 0,
                    p30s: 0,
                    p60s: 0,
                    p120s: 0,
                    p300s: 0,
                    p600s: 0,
                    p1200s: 0,
                    p1800s: 0,
                    p3600s: 0,
                };

                const powers = records.map((r: any) => r.power || 0);

                if (powers.length > 0) {
                    const windows = [
                        1, 5, 10, 20, 30, 60, 120, 300, 600, 1200, 1800, 3600,
                    ];

                    windows.forEach((w) => {
                        if (powers.length >= w) {
                            let currentSum = 0;
                            for (let i = 0; i < w; i++) currentSum += powers[i];
                            let maxAvg = currentSum / w;

                            for (let i = w; i < powers.length; i++) {
                                currentSum =
                                    currentSum - powers[i - w] + powers[i];
                                const avg = currentSum / w;
                                if (avg > maxAvg) maxAvg = avg;
                            }
                            (powerCurve as any)[`p${w}s`] = Math.round(maxAvg);
                        }
                    });
                }

                const duration = safeNum(
                    session.total_timer_time || session.total_elapsed_time,
                );
                const power = safeNum(session.avg_power);
                const calculatedWorkKj = (power * duration) / 1000;

                let np = safeNum(session.normalized_power);

                if (np === 0 && powers.length >= 30) {
                    let sumFourthPower = 0;
                    let count = 0;
                    let currentSum = 0;

                    for (let i = 0; i < 30; i++) currentSum += powers[i];

                    for (let i = 29; i < powers.length; i++) {
                        if (i > 29) {
                            currentSum =
                                currentSum - powers[i - 30] + powers[i];
                        }
                        const avg30 = currentSum / 30;
                        sumFourthPower += Math.pow(avg30, 4);
                        count++;
                    }
                    np = Math.round(Math.pow(sumFourthPower / count, 0.25));
                } else if (np === 0 && powers.length > 0) {
                    np = power;
                }

                let finalTss = safeNum(session.training_stress_score);
                let finalIf = safeFloat(session.intensity_factor);

                if ((finalTss === 0 || finalIf === 0) && np > 0) {
                    finalIf = safeFloat(np / userFtp);
                    const rawTss =
                        ((duration * np * finalIf) / (userFtp * 3600)) * 100;
                    finalTss = Math.round(rawTss);
                }

                const rawHrZones = session.time_in_hr_zone || [];
                const rawPowerZones = session.time_in_power_zone || [];
                const hrZones = [
                    safeNum(rawHrZones[0]),
                    safeNum(rawHrZones[1]),
                    safeNum(rawHrZones[2]),
                    safeNum(rawHrZones[3]),
                    safeNum(rawHrZones[4]),
                ];
                const powerZones = [
                    safeNum(rawPowerZones[0]),
                    safeNum(rawPowerZones[1]),
                    safeNum(rawPowerZones[2]),
                    safeNum(rawPowerZones[3]),
                    safeNum(rawPowerZones[4]),
                    safeNum(rawPowerZones[5]),
                    safeNum(rawPowerZones[6]),
                ];

                const newActivity = await ActivityModel.create({
                    athleteId: userId,
                    garminActivityId: null,
                    title: `${session.name || "Activity"} (${activityDate.toLocaleDateString()})`,
                    manufacturer: session.manufacturer || "unknown",
                    sportType: session.sport || "cycling",
                    startTime: activityDate,
                    durationSec: duration,
                    distanceMeters: safeNum(session.total_distance),
                    summary: {
                        tss: finalTss,
                        np: np,
                        if: finalIf,
                        workKj: Math.round(calculatedWorkKj),
                        calories: safeNum(session.total_calories),
                        trainingLoad: safeNum(session.training_load),
                        aerobicTe: safeFloat(session.total_training_effect),
                        anaerobicTe: safeFloat(
                            session.total_anaerobic_training_effect,
                        ),
                        avgHr: safeNum(session.avg_heart_rate),
                        maxHr: safeNum(session.max_heart_rate),
                        avgPower: power,
                        maxPower: safeNum(session.max_power) || powerCurve.p1s,
                        max20MinPower:
                            safeNum(session.max_20_min_power) ||
                            powerCurve.p1200s,
                        avgCadence: safeNum(session.avg_cadence),
                        maxCadence: safeNum(session.max_cadence),
                        avgSpeed: safeFloat(session.avg_speed),
                        maxSpeed: safeFloat(session.max_speed),
                        elevationGain: safeNum(session.total_ascent),
                        elevationLoss: safeNum(session.total_descent),
                        powerCurve: powerCurve,
                        timeInZones: { hr: hrZones, power: powerZones },
                    },
                });
                const dbActivityId = newActivity._id;

                const baseEffort = {
                    activityId: dbActivityId,
                    garminActivityId: null,
                    date: activityDate,
                };

                const distanceValue = safeNum(session.total_distance);
                if (distanceValue > 0) {
                    const updated = updateTop3(userStats.cycling.longestRide, {
                        ...baseEffort,
                        value: distanceValue,
                    });
                    if (updated) isModified = true;
                }

                const elevationGain = safeNum(session.total_ascent);
                if (elevationGain > 0) {
                    const updated = updateTop3(
                        userStats.cycling.elevation.maxElevationGain,
                        { ...baseEffort, value: elevationGain },
                    );
                    if (updated) isModified = true;
                }

                const powerKeys = [
                    "p1s",
                    "p5s",
                    "p20s",
                    "p60s",
                    "p300s",
                    "p1200s",
                    "p3600s",
                ];
                powerKeys.forEach((key) => {
                    const value = (powerCurve as any)[key];
                    if (value > 0) {
                        const updated = updateTop3(
                            (userStats.cycling.powerCurve as any)[key],
                            { ...baseEffort, value },
                        );
                        if (updated) isModified = true;
                    }
                });

                const startOfDay = new Date(activityDate);
                startOfDay.setUTCHours(0, 0, 0, 0);
                const endOfDay = new Date(activityDate);
                endOfDay.setUTCHours(23, 59, 59, 999);

                await PlannedWorkoutModel.findOneAndUpdate(
                    {
                        athleteId: userId,
                        scheduledDate: { $gte: startOfDay, $lt: endOfDay },
                        status: "scheduled",
                    },
                    { $set: { status: "completed" } },
                    { sort: { scheduledDate: 1 } },
                );

                if (parsedData.laps && parsedData.laps.length > 0) {
                    const lapsToInsert = parsedData.laps.map(
                        (lap: any, index: number) => ({
                            lapIndex: index + 1,
                            startTime: lap.start_time,
                            durationSec:
                                lap.total_timer_time ||
                                lap.total_elapsed_time ||
                                0,
                            distanceMeters: lap.total_distance || 0,
                            avgPower: lap.avg_power || 0,
                            maxPower: lap.max_power || 0,
                            avgHr: lap.avg_heart_rate || 0,
                            maxHr: lap.max_heart_rate || 0,
                            avgCadence: lap.avg_cadence || 0,
                            avgSpeed: lap.avg_speed || 0,
                        }),
                    );
                    await ActivityModel.findByIdAndUpdate(dbActivityId, {
                        $set: { laps: lapsToInsert },
                    });
                }

                if (records.length > 0) {
                    const streamDataToInsert = records.map((record: any) => ({
                        timestamp: record.timestamp,
                        metadata: {
                            activityId: dbActivityId,
                            athleteId: userId,
                        },
                        measurements: {
                            watts: record.power || 0,
                            hr: record.heart_rate || 0,
                            cadence: record.cadence || 0,
                            speedKmh: record.speed || 0,
                            altitude: record.altitude || 0,
                            lat: record.position_lat || null,
                            lng: record.position_long || null,
                        },
                    }));
                    await ActivityStreamModel.insertMany(streamDataToInsert, {
                        ordered: false,
                    });
                }

                results.successful++;
                pmcNeedsRecalc = true;
            } catch (err: any) {
                console.error(
                    `Error processing file ${item.fileName}:`,
                    err.message,
                );
                results.failed++;
                results.errors.push(`${item.fileName}: ${err.message}`);
            }
        }

        if (isModified) {
            await userStats.save();
        }

        if (pmcNeedsRecalc) {
            await recalculatePMC(userId.toString(), oldestActivityDate);
        }

        return res
            .status(201)
            .json(
                successResponse(
                    results,
                    `Bulk upload complete. Successful: ${results.successful}, Failed: ${results.failed}`,
                ),
            );
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(
                errorResponse(null, "Internal server error during upload", 500),
            );
    }
};
