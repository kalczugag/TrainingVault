import { GarminConnect } from "@flow-js/garmin-connect";
import { decrypt } from "../utils/crypto";
import { safeNum, safeFloat } from "utils/helpers";
import { recalculatePMC } from "./pmcService";
import { ActivityModel } from "../models/Activity";
import { PlannedWorkoutModel } from "../models/PlannedWorkout";
import { UserModel } from "../models/User";
import { UserStatModel } from "../models/UserStat";

interface CachedClient {
    client: GarminConnect;
    lastUsed: number;
    credentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    };
}

const clientsCache = new Map<string, CachedClient>();
const pendingLogins = new Map<string, Promise<GarminConnect>>();

const SESSION_TTL_MS = 60 * 60 * 1000;
setInterval(() => {
    const now = Date.now();
    for (const [userId, cached] of clientsCache.entries()) {
        if (now - cached.lastUsed > SESSION_TTL_MS) {
            clientsCache.delete(userId);
        }
    }
}, SESSION_TTL_MS);

const loginUser = async (
    userId: string,
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    },
): Promise<GarminConnect> => {
    if (pendingLogins.has(userId)) {
        return pendingLogins.get(userId)!;
    }

    const loginPromise = (async () => {
        try {
            const plainPassword = decrypt(
                garminCredentials.passwordEncrypted,
                garminCredentials.iv,
            );

            const newClient = new GarminConnect({
                username: garminCredentials.email,
                password: plainPassword,
            });

            await newClient.login();

            clientsCache.set(userId, {
                client: newClient,
                lastUsed: Date.now(),
                credentials: garminCredentials,
            });

            return newClient;
        } finally {
            pendingLogins.delete(userId);
        }
    })();

    pendingLogins.set(userId, loginPromise);
    return loginPromise;
};

export const getGarminClient = async (
    userId: string,
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    },
): Promise<GarminConnect> => {
    const cached = clientsCache.get(userId);

    if (cached) {
        cached.lastUsed = Date.now();
        return cached.client;
    }

    return loginUser(userId, garminCredentials);
};

export const withGarminClient = async <T>(
    userId: string,
    garminCredentials: {
        email: string;
        passwordEncrypted: string;
        iv: string;
    },
    fn: (client: GarminConnect) => Promise<T>,
): Promise<T> => {
    const client = await getGarminClient(userId, garminCredentials);

    try {
        return await fn(client);
    } catch (error: any) {
        const isSessionError =
            error?.status === 401 ||
            error?.statusCode === 401 ||
            error?.message?.toLowerCase().includes("session") ||
            error?.message?.toLowerCase().includes("unauthorized") ||
            error?.message?.toLowerCase().includes("login");

        if (isSessionError) {
            clientsCache.delete(userId);
            const freshClient = await getGarminClient(
                userId,
                garminCredentials,
            );
            return await fn(freshClient);
        }

        throw error;
    }
};

export const removeGarminClient = (userId: string) => {
    clientsCache.delete(userId);
    pendingLogins.delete(userId);
};

export const updateTop3 = (
    currentTop3: any[],
    newEffort: any,
    isTime: boolean = false,
) => {
    const existsIndex = currentTop3.findIndex(
        (e) => e.garminActivityId === newEffort.garminActivityId,
    );

    if (existsIndex !== -1) {
        if (
            isTime
                ? newEffort.value < currentTop3[existsIndex].value
                : newEffort.value > currentTop3[existsIndex].value
        ) {
            currentTop3[existsIndex] = newEffort;
        } else {
            return false;
        }
    } else {
        currentTop3.push(newEffort);
    }

    if (isTime) {
        currentTop3.sort((a, b) => a.value - b.value);
    } else {
        currentTop3.sort((a, b) => b.value - a.value);
    }

    currentTop3.splice(3);

    return currentTop3.some(
        (e) => e.garminActivityId === newEffort.garminActivityId,
    );
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

    let consecutiveExistingCount = 0;

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

            if (exists) {
                consecutiveExistingCount++;

                if (consecutiveExistingCount >= 3) {
                    keepFetching = false;
                    break;
                }

                continue;
            }

            consecutiveExistingCount = 0;

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

            const newActivity = await ActivityModel.create({
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

            let userStats = await UserStatModel.findOne({ athleteId: userId });
            if (!userStats) {
                userStats = new UserStatModel({ athleteId: userId });
            }

            let isModified = false;

            const baseEffort = {
                activityId: newActivity._id,
                garminActivityId: rawAct.activityId.toString(),
                date: activityDate,
            };

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
                const garminKey = `maxAvgPower_${key.replace("p", "").replace("s", "")}`;
                const value = safeNum(rawAct[garminKey]);

                if (value > 0) {
                    const updated = updateTop3(
                        userStats.cycling.powerCurve[key],
                        { ...baseEffort, value },
                    );
                    if (updated) isModified = true;
                }
            });

            const distanceValue = safeNum(rawAct.distance);
            if (distanceValue > 0) {
                const updated = updateTop3(userStats.cycling.longestRide, {
                    ...baseEffort,
                    value: distanceValue,
                });
                if (updated) isModified = true;
            }

            const elevationGain = safeNum(rawAct.elevationGain);
            if (elevationGain > 0) {
                const updated = updateTop3(
                    userStats.cycling.elevation.maxElevationGain,
                    { ...baseEffort, value: elevationGain },
                );
                if (updated) isModified = true;
            }

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

            newActivitiesCount++;
        }

        if (!keepFetching) break;

        start += limit;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (newActivitiesCount > 0) {
        await recalculatePMC(userId.toString(), oldestActivityDate);
    }

    return newActivitiesCount;
};

export const recalculateAllUserStats = async (userId: string) => {
    await UserStatModel.findOneAndDelete({ athleteId: userId });

    const userStats = new UserStatModel({ athleteId: userId });

    const activities = await ActivityModel.find({
        athleteId: userId,
        sportType: "cycling",
    }).sort({ startTime: 1 });

    if (!activities || activities.length === 0) {
        return { message: "No activities to process", count: 0 };
    }

    for (const act of activities) {
        const baseEffort = {
            activityId: act._id,
            garminActivityId: act.garminActivityId,
            date: act.startTime,
        };

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
            const value =
                act.summary?.powerCurve?.[
                    key as keyof typeof act.summary.powerCurve
                ] || 0;

            if (value > 0) {
                updateTop3(userStats.cycling.powerCurve[key], {
                    ...baseEffort,
                    value,
                });
            }
        });

        const distanceValue = act.distanceMeters || 0;
        if (distanceValue > 0) {
            updateTop3(userStats.cycling.longestRide, {
                ...baseEffort,
                value: distanceValue,
            });
        }

        const elevationGain = act.summary?.elevationGain || 0;
        if (elevationGain > 0) {
            updateTop3(userStats.cycling.elevation.maxElevationGain, {
                ...baseEffort,
                value: elevationGain,
            });
        }
    }

    await userStats.save();

    return {
        message: "User stats recalculated successfully",
        analyzedActivities: activities.length,
    };
};
