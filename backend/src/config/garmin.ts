import mongoose from "mongoose";
import { GarminConnect } from "@flow-js/garmin-connect";
import { decrypt } from "../utils/crypto";
import { recalculatePMC } from "./pmcService";
import { ActivityModel } from "../models/Activity";
import { PlannedWorkoutModel } from "../models/PlannedWorkout";
import { UserModel } from "../models/User";

const clientsCache = new Map<string, GarminConnect>();

export const getGarminClient = async (
    userId: string,
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    },
): Promise<GarminConnect> => {
    if (clientsCache.has(userId)) {
        return clientsCache.get(userId)!;
    }

    const plainPassword = decrypt(
        garminCredentials.passwordEncrypted,
        garminCredentials.iv,
    );

    const newClient = new GarminConnect({
        username: garminCredentials.email,
        password: plainPassword,
    });

    await newClient.login();

    clientsCache.set(userId, newClient);

    return newClient;
};

export const removeGarminClient = (userId: string) => {
    clientsCache.delete(userId);
};

const safeNum = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : Math.round(num);
};

const safeFloat = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : parseFloat(num.toFixed(3));
};

export const syncGarminForUser = async (userId: string): Promise<number> => {
    const user = await UserModel.findById(userId)
        .select("+garminCredentials")
        .exec();

    if (!user || !user.garminCredentials) {
        throw new Error("USER_NOT_FOUND_OR_NO_CREDENTIALS");
    }

    const garminClient = await getGarminClient(
        user._id,
        user.garminCredentials,
    );

    let start = 0;
    const limit = 50;
    let keepFetching = true;
    let newActivitiesCount = 0;
    let oldestActivityDate = new Date();

    let userFtp = 251;
    if (user.thresholdHistory && user.thresholdHistory.length > 0) {
        userFtp =
            user.thresholdHistory[user.thresholdHistory.length - 1].ftp || 250;
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    while (keepFetching) {
        const activities = await garminClient.getActivities(start, limit);

        if (!activities || activities.length === 0) break;

        for (const garminAct of activities) {
            const rawAct = garminAct as any;
            const activityDate = new Date(rawAct.startTimeLocal);

            if (activityDate < oneYearAgo) {
                keepFetching = false;
                break;
            }

            const exists = await ActivityModel.exists({
                garminActivityId: rawAct.activityId.toString(),
            });

            if (!exists) {
                if (activityDate < oldestActivityDate) {
                    oldestActivityDate = activityDate;
                }

                const np = safeNum(rawAct.normPower);
                const duration = safeNum(rawAct.duration);
                const power = safeNum(rawAct.averagePower || rawAct.avgPower);
                const calculatedWorkKj = (power * duration) / 1000;

                let finalTss = safeNum(rawAct.trainingStressScore);
                let finalIf = safeFloat(rawAct.intensityFactor);

                if (finalTss === 0 && np > 0) {
                    finalIf = safeFloat(np / userFtp);
                    const rawTss =
                        ((duration * np * finalIf) / (userFtp * 3600)) * 100;
                    finalTss = Math.round(rawTss);
                }

                const hrZones = [
                    safeNum(rawAct.hrTimeInZone_1),
                    safeNum(rawAct.hrTimeInZone_2),
                    safeNum(rawAct.hrTimeInZone_3),
                    safeNum(rawAct.hrTimeInZone_4),
                    safeNum(rawAct.hrTimeInZone_5),
                ];

                const powerZones = [
                    safeNum(rawAct.powerTimeInZone_1),
                    safeNum(rawAct.powerTimeInZone_2),
                    safeNum(rawAct.powerTimeInZone_3),
                    safeNum(rawAct.powerTimeInZone_4),
                    safeNum(rawAct.powerTimeInZone_5),
                    safeNum(rawAct.powerTimeInZone_6),
                    safeNum(rawAct.powerTimeInZone_7),
                ];

                await ActivityModel.create({
                    athleteId: userId,
                    garminActivityId: rawAct.activityId.toString(),
                    title: rawAct.activityName || "Trening",
                    manufacturer: rawAct.manufacturer,
                    sportType: "cycling",
                    startTime: activityDate,
                    durationSec: duration,
                    distanceMeters: safeNum(rawAct.distance),
                    summary: {
                        tss: finalTss,
                        np: np,
                        if: finalIf,
                        workKj: Math.round(calculatedWorkKj),
                        calories: safeNum(rawAct.calories),
                        trainingLoad: safeNum(rawAct.activityTrainingLoad),
                        aerobicTe: safeFloat(rawAct.aerobicTrainingEffect),
                        anaerobicTe: safeFloat(rawAct.anaerobicTrainingEffect),
                        avgHr: safeNum(rawAct.averageHR),
                        maxHr: safeNum(rawAct.maxHR),
                        avgPower: power,
                        maxPower: safeNum(rawAct.maxPower),
                        max20MinPower: safeNum(rawAct.max20MinPower),
                        avgCadence: safeNum(
                            rawAct.averageBikingCadenceInRevPerMinute ||
                                rawAct.averageRunningCadenceInStepsPerMinute,
                        ),
                        maxCadence: safeNum(
                            rawAct.maxBikingCadenceInRevPerMinute ||
                                rawAct.maxRunningCadenceInStepsPerMinute,
                        ),
                        avgSpeed: safeFloat(rawAct.averageSpeed),
                        maxSpeed: safeFloat(rawAct.maxSpeed),
                        elevationGain: safeNum(rawAct.elevationGain),
                        elevationLoss: safeNum(rawAct.elevationLoss),
                        powerCurve: {
                            p1s: safeNum(rawAct.maxAvgPower_1),
                            p2s: safeNum(rawAct.maxAvgPower_2),
                            p5s: safeNum(rawAct.maxAvgPower_5),
                            p10s: safeNum(rawAct.maxAvgPower_10),
                            p20s: safeNum(rawAct.maxAvgPower_20),
                            p30s: safeNum(rawAct.maxAvgPower_30),
                            p60s: safeNum(rawAct.maxAvgPower_60),
                            p120s: safeNum(rawAct.maxAvgPower_120),
                            p300s: safeNum(rawAct.maxAvgPower_300),
                            p600s: safeNum(rawAct.maxAvgPower_600),
                            p1200s: safeNum(rawAct.maxAvgPower_1200),
                            p1800s: safeNum(rawAct.maxAvgPower_1800),
                            p3600s: safeNum(rawAct.maxAvgPower_3600),
                        },
                        timeInZones: { hr: hrZones, power: powerZones },
                    },
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

                newActivitiesCount++;
            }
        }

        start += limit;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (newActivitiesCount > 0) {
        await recalculatePMC(userId.toString(), oldestActivityDate);
    }

    return newActivitiesCount;
};
