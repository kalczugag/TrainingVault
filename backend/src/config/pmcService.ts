import mongoose from "mongoose";
import { DailyStatModel } from "../models/DailyStat";
import { ActivityModel } from "../models/Activity";

const getMidnightUTC = (date: Date): Date => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

export const recalculatePMC = async (athleteId: string, startDate: Date) => {
    const start = getMidnightUTC(startDate);
    const today = getMidnightUTC(new Date());

    const dayBeforeStart = new Date(start);
    dayBeforeStart.setUTCDate(dayBeforeStart.getUTCDate() - 1);

    const prevStart = await DailyStatModel.findOne({
        athleteId,
        date: dayBeforeStart,
    }).lean();

    let prevCtl = prevStart?.ctl || 0;
    let prevAtl = prevStart?.atl || 0;

    const activities = await ActivityModel.aggregate([
        {
            $match: {
                athleteId: new mongoose.Types.ObjectId(athleteId),
                startTime: { $gte: start },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$startTime" },
                },
                dailyTss: { $sum: "$summary.tss" },
                dailyWorkKj: { $sum: "$summary.workKj" },
                dailyDurationSec: { $sum: "$durationSec" },
                dailyDistanceMeters: { $sum: "$distanceMeters" },
                dailyElevationGain: { $sum: "$summary.elevationGain" },
            },
        },
    ]);

    const activitiesMap = activities.reduce(
        (acc, curr) => {
            acc[curr._id] = curr;
            return acc;
        },
        {} as Record<string, any>,
    );

    const bulkOperations = [];

    let currentDate = new Date(start);

    while (currentDate <= today) {
        const dateString = currentDate.toISOString().split("T")[0];
        const todaysActivity = activitiesMap[dateString];

        if (todaysActivity && todaysActivity.dailyDurationSec > 0) {
            console.log(
                `[DEBUG] Dzień: ${dateString} | Dystans: ${todaysActivity.dailyDistanceMeters} | Przewyższenia: ${todaysActivity.dailyElevationGain}`,
            );
        }

        const dailyTss = todaysActivity?.dailyTss || 0;
        const dailyWorkKj = todaysActivity?.dailyWorkKj || 0;
        const dailyDurationSec = todaysActivity?.dailyDurationSec || 0;
        const dailyDistanceMeters = todaysActivity?.dailyDistanceMeters || 0;
        const dailyElevationGain = todaysActivity?.dailyElevationGain || 0;

        const currentTsb = prevCtl - prevAtl;
        const currentCtl = prevCtl + (dailyTss - prevCtl) * (1 / 42);
        const currentAtl = prevAtl + (dailyTss - prevAtl) * (1 / 7);

        bulkOperations.push({
            updateOne: {
                filter: { athleteId, date: new Date(currentDate) },
                update: {
                    $set: {
                        dailyTss,
                        dailyWorkKj,
                        dailyDurationSec,
                        dailyDistanceMeters,
                        dailyElevationGain,
                        ctl: currentCtl,
                        atl: currentAtl,
                        tsb: currentTsb,
                    },
                },
                upsert: true,
            },
        });

        prevCtl = currentCtl;
        prevAtl = currentAtl;
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    if (bulkOperations.length > 0) {
        await DailyStatModel.bulkWrite(bulkOperations);
    }
};
