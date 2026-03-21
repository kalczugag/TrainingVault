import axios from "axios";
import { UserModel } from "../models/User";
import { ActivityModel } from "../models/Activity";
import { ActivityStreamModel } from "../models/ActivityStream";
import { UserStatModel } from "../models/UserStat";
import { PlannedWorkoutModel } from "../models/PlannedWorkout";
import { recalculatePMC } from "./pmcService";
import { safeNum, safeFloat } from "../utils/helpers";

export const updateTop3 = (
    currentTop3: any[],
    newEffort: any,
    isTime: boolean = false,
) => {
    const existsIndex = currentTop3.findIndex(
        (e) => e.activityId.toString() === newEffort.activityId.toString(),
    );
    if (existsIndex !== -1) {
        if (
            isTime
                ? newEffort.value < currentTop3[existsIndex].value
                : newEffort.value > currentTop3[existsIndex].value
        ) {
            currentTop3[existsIndex] = newEffort;
        } else return false;
    } else currentTop3.push(newEffort);

    if (isTime) currentTop3.sort((a, b) => a.value - b.value);
    else currentTop3.sort((a, b) => b.value - a.value);
    currentTop3.splice(3);
    return true;
};

export const getValidStravaToken = async (userId: string): Promise<string> => {
    const user = await UserModel.findById(userId)
        .select("+stravaCredentials")
        .exec();
    if (!user || !user.stravaCredentials)
        throw new Error("USER_NOT_FOUND_OR_NO_STRAVA_CREDENTIALS");

    const { stravaAccessToken, stravaRefreshToken, stravaTokenExpiresAt } =
        user.stravaCredentials;
    const currentTimestampSec = Math.floor(Date.now() / 1000);

    if (stravaTokenExpiresAt > currentTimestampSec + 300)
        return stravaAccessToken;

    try {
        const response = await axios.post(
            "https://www.strava.com/oauth/token",
            {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: stravaRefreshToken,
            },
        );

        user.stravaCredentials.stravaAccessToken = response.data.access_token;
        user.stravaCredentials.stravaRefreshToken = response.data.refresh_token;
        user.stravaCredentials.stravaTokenExpiresAt = response.data.expires_at;
        await user.save();
        return response.data.access_token;
    } catch (error: any) {
        throw new Error("Strava session expired and could not be refreshed.");
    }
};

export const processStravaActivity = async (
    stravaActivityId: string | number,
    userId: string,
) => {
    const exists = await ActivityModel.exists({
        stravaActivityId: stravaActivityId.toString(),
    });
    if (exists) return { status: "exists", id: stravaActivityId };

    const token = await getValidStravaToken(userId);
    const headers = { Authorization: `Bearer ${token}` };

    const { data: act } = await axios.get(
        `https://www.strava.com/api/v3/activities/${stravaActivityId}`,
        { headers },
    );

    if (act.type !== "Ride" && act.type !== "VirtualRide")
        return { status: "ignored_sport", id: stravaActivityId };

    const keys =
        "time,latlng,distance,altitude,velocity_smooth,heartrate,cadence,watts";
    const [streamRes, lapsRes] = await Promise.all([
        axios
            .get(
                `https://www.strava.com/api/v3/activities/${stravaActivityId}/streams`,
                {
                    headers,
                    params: { keys, key_by_type: true },
                },
            )
            .catch((err) => {
                return { data: {} };
            }),
        axios
            .get(
                `https://www.strava.com/api/v3/activities/${stravaActivityId}/laps`,
                {
                    headers,
                },
            )
            .catch(() => ({ data: [] })),
    ]);

    const stravaStreams = streamRes.data || {};
    const stravaLaps = lapsRes.data || [];
    const activityDate = new Date(act.start_date);

    const sMap: Record<string, any[]> = {};

    if (Array.isArray(stravaStreams)) {
        stravaStreams.forEach((s: any) => {
            sMap[s.type] = s.data;
        });
    } else if (typeof stravaStreams === "object") {
        Object.keys(stravaStreams).forEach((key) => {
            sMap[key] = stravaStreams[key].data || [];
        });
    }

    const timeArr = sMap.time || [];
    const wattsArr = sMap.watts || [];
    const hrArr = sMap.heartrate || [];

    const powerCurve = {
        p1s: 0,
        p2s: 0,
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
    if (wattsArr.length > 0) {
        const windows = [
            1, 2, 5, 10, 20, 30, 60, 120, 300, 600, 1200, 1800, 3600,
        ];
        windows.forEach((w) => {
            if (wattsArr.length >= w) {
                let currentSum = 0;
                for (let i = 0; i < w; i++) currentSum += wattsArr[i];
                let maxAvg = currentSum / w;
                for (let i = w; i < wattsArr.length; i++) {
                    currentSum = currentSum - wattsArr[i - w] + wattsArr[i];
                    const avg = currentSum / w;
                    if (avg > maxAvg) maxAvg = avg;
                }
                (powerCurve as any)[`p${w}s`] = Math.round(maxAvg);
            }
        });
    }

    const duration = safeNum(act.elapsed_time);
    const power = safeNum(act.average_watts);
    const calculatedWorkKj =
        safeNum(act.kilojoules) || (power * duration) / 1000;

    const user = await UserModel.findById(userId)
        .populate("thresholdHistory")
        .exec();
    let userFtp = 251;
    if (user && (user as any).thresholdHistory?.length > 0) {
        userFtp =
            (user as any).thresholdHistory[
                (user as any).thresholdHistory.length - 1
            ].ftp || 250;
    }

    let np = safeNum(act.weighted_average_watts);
    if (np === 0 && wattsArr.length >= 30) {
        let sumFourthPower = 0;
        let currentSum = 0;
        let count = 0;
        for (let i = 0; i < 30; i++) currentSum += wattsArr[i];
        for (let i = 29; i < wattsArr.length; i++) {
            if (i > 29)
                currentSum = currentSum - wattsArr[i - 30] + wattsArr[i];
            sumFourthPower += Math.pow(currentSum / 30, 4);
            count++;
        }
        np = Math.round(Math.pow(sumFourthPower / count, 0.25));
    } else if (np === 0 && wattsArr.length > 0) np = power;

    let finalIf = np > 0 ? safeFloat(np / userFtp) : 0;
    let finalTss =
        np > 0
            ? Math.round(((duration * np * finalIf) / (userFtp * 3600)) * 100)
            : 0;

    const pZones = [0, 0, 0, 0, 0, 0, 0];
    const hZones = [0, 0, 0, 0, 0];
    const userMaxHr = safeNum(act.max_heartrate) || 190;

    for (let i = 1; i < timeArr.length; i++) {
        const dt = timeArr[i] - timeArr[i - 1];
        const timeToAdd = dt > 0 && dt < 10 ? dt : 1;

        if (wattsArr[i] != null) {
            const p = wattsArr[i];
            if (p < 0.55 * userFtp) pZones[0] += timeToAdd;
            else if (p < 0.75 * userFtp) pZones[1] += timeToAdd;
            else if (p < 0.9 * userFtp) pZones[2] += timeToAdd;
            else if (p < 1.05 * userFtp) pZones[3] += timeToAdd;
            else if (p < 1.2 * userFtp) pZones[4] += timeToAdd;
            else if (p < 1.5 * userFtp) pZones[5] += timeToAdd;
            else pZones[6] += timeToAdd;
        }

        if (hrArr[i] != null) {
            const hr = hrArr[i];
            if (hr < 0.6 * userMaxHr) hZones[0] += timeToAdd;
            else if (hr < 0.7 * userMaxHr) hZones[1] += timeToAdd;
            else if (hr < 0.8 * userMaxHr) hZones[2] += timeToAdd;
            else if (hr < 0.9 * userMaxHr) hZones[3] += timeToAdd;
            else hZones[4] += timeToAdd;
        }
    }

    const newActivity = await ActivityModel.create({
        athleteId: userId,
        stravaActivityId: stravaActivityId.toString(),
        garminActivityId: null,
        title: act.name || "Trening",
        manufacturer: act.device_name || "Strava",
        sportType: "cycling",
        startTime: activityDate,
        durationSec: duration,
        distanceMeters: safeNum(act.distance),
        summary: {
            tss: finalTss,
            np: np,
            if: finalIf,
            workKj: Math.round(calculatedWorkKj),
            calories: safeNum(act.calories),
            trainingLoad: 0,
            aerobicTe: 0,
            anaerobicTe: 0,
            avgHr: safeNum(act.average_heartrate),
            maxHr: safeNum(act.max_heartrate),
            avgPower: power,
            maxPower: safeNum(act.max_watts) || powerCurve.p1s,
            max20MinPower: powerCurve.p1200s,
            avgCadence: safeNum(act.average_cadence),
            maxCadence: safeNum(act.max_cadence),
            avgSpeed: safeFloat(act.average_speed),
            maxSpeed: safeFloat(act.max_speed),
            elevationGain: safeNum(act.total_elevation_gain),
            powerCurve: powerCurve,
            timeInZones: {
                hr: hZones.map((z) => Math.round(z)),
                power: pZones.map((z) => Math.round(z)),
            },
        },
    });

    const dbActivityId = newActivity._id;

    if (timeArr.length > 0) {
        const streamDataToInsert = timeArr.map((t, i) => ({
            timestamp: new Date(activityDate.getTime() + t * 1000),
            metadata: { activityId: dbActivityId, athleteId: userId },
            measurements: {
                watts: sMap.watts?.[i] || 0,
                hr: sMap.heartrate?.[i] || 0,
                cadence: sMap.cadence?.[i] || 0,
                speedKmh: sMap.velocity_smooth?.[i]
                    ? Number((sMap.velocity_smooth[i] * 3.6).toFixed(2))
                    : 0,
                altitude: sMap.altitude?.[i] || 0,
                lat: sMap.latlng?.[i]?.[0] || null,
                lng: sMap.latlng?.[i]?.[1] || null,
            },
        }));

        const BATCH_SIZE = 1000;
        for (let i = 0; i < streamDataToInsert.length; i += BATCH_SIZE) {
            await ActivityStreamModel.insertMany(
                streamDataToInsert.slice(i, i + BATCH_SIZE),
                { ordered: false },
            );
        }
    }

    if (stravaLaps.length > 0) {
        const lapsToInsert = stravaLaps.map((lap: any) => ({
            lapIndex: lap.lap_index,
            startTime: lap.start_date,
            durationSec: lap.elapsed_time || 0,
            distanceMeters: lap.distance || 0,
            avgPower: lap.average_watts || 0,
            maxPower: lap.max_watts || 0,
            avgHr: lap.average_heartrate || 0,
            maxHr: lap.max_heartrate || 0,
            avgCadence: lap.average_cadence || 0,
            avgSpeed: lap.average_speed || 0,
        }));
        await ActivityModel.findByIdAndUpdate(dbActivityId, {
            $set: { laps: lapsToInsert },
        });
    }

    let userStats =
        (await UserStatModel.findOne({ athleteId: userId })) ||
        new UserStatModel({ athleteId: userId });
    let isModified = false;
    const baseEffort = {
        activityId: dbActivityId,
        stravaActivityId: stravaActivityId.toString(),
        date: activityDate,
    };

    if (
        act.distance > 0 &&
        updateTop3(userStats.cycling.longestRide, {
            ...baseEffort,
            value: act.distance,
        })
    )
        isModified = true;
    if (
        act.total_elevation_gain > 0 &&
        updateTop3(userStats.cycling.elevation.maxElevationGain, {
            ...baseEffort,
            value: act.total_elevation_gain,
        })
    )
        isModified = true;

    ["p1s", "p5s", "p20s", "p60s", "p300s", "p1200s", "p3600s"].forEach(
        (key) => {
            const val = (powerCurve as any)[key];
            if (
                val > 0 &&
                updateTop3((userStats.cycling.powerCurve as any)[key], {
                    ...baseEffort,
                    value: val,
                })
            )
                isModified = true;
        },
    );

    if (isModified) await userStats.save();

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

    return { status: "created", id: stravaActivityId, date: activityDate };
};

export const syncStravaForUser = async (userId: string): Promise<number> => {
    const lastActivity = await ActivityModel.findOne({
        athleteId: userId,
    }).sort({ startTime: -1 });
    const afterDate = lastActivity
        ? new Date(lastActivity.startTime)
        : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const afterTimestamp = Math.floor(afterDate.getTime() / 1000);

    const token = await getValidStravaToken(userId);
    let page = 1;
    let newActivitiesCount = 0;
    let oldestDate = new Date();

    while (true) {
        const { data: activities } = await axios.get(
            "https://www.strava.com/api/v3/athlete/activities",
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { after: afterTimestamp, per_page: 30, page: page },
            },
        );

        if (activities.length === 0) break;

        for (const act of activities) {
            const res = await processStravaActivity(act.id, userId);
            if (res.status === "created") {
                newActivitiesCount++;
                if (res.date && res.date < oldestDate) oldestDate = res.date;
            }
        }
        page++;
    }

    if (newActivitiesCount > 0) {
        await recalculatePMC(userId.toString(), oldestDate);
    }
    return newActivitiesCount;
};
