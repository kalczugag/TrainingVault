import mongoose from "mongoose";
import { ActivityModel } from "../models/Activity";
import { dailyStatModel, DailyStatModel } from "../models/DailyStat";
import { WeeklyStatModel } from "../models/WeeklyStat";

const getMondayUTC = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getUTCDay();

    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
    d.setUTCDate(diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

export const recalculateWeeklyStats = async (
    athleteId: string,
    startDate: Date,
) => {
    const startMonday = getMondayUTC(startDate);
    const todayMonday = getMondayUTC(new Date());

    const userObjectId = new mongoose.Types.ObjectId(athleteId);

    const activities = await ActivityModel.find({
        athleteId: userObjectId,
        startTime: { $gte: startMonday },
    }).lean();

    const dailyStats = await DailyStatModel.find({
        athleteId: athleteId,
        date: { $gte: startMonday },
    }).lean();

    const dailyStatsMap = dailyStats.reduce(
        (acc, curr) => {
            const dateStr = curr.date.toISOString().split("T")[0];
            acc[dateStr] = curr;
            return acc;
        },
        {} as Record<string, any>,
    );

    const bulkOperations = [];
    let currentWeekStart = new Date(startMonday);

    while (currentWeekStart <= todayMonday) {
        const safeWeekStart = new Date(currentWeekStart);
        const currentWeekEnd = new Date(safeWeekStart);
        currentWeekEnd.setUTCDate(currentWeekEnd.getUTCDate() + 6);
        currentWeekEnd.setUTCHours(23, 59, 59, 999);

        const weeksActivities = activities.filter(
            (act) =>
                act.startTime >= safeWeekStart &&
                act.startTime <= currentWeekEnd,
        );

        let totalTss = 0;
        let totalWorkKj = 0;
        let totalDurationSec = 0;
        let totalDistanceMeters = 0;
        let totalElevationGain = 0;

        const distancePerSport = { cycling: 0, running: 0, swimming: 0 };
        const durationPerSport = { cycling: 0, running: 0, swimming: 0 };

        for (const act of weeksActivities) {
            totalTss += act.summary?.tss || 0;
            totalWorkKj += act.summary?.workKj || 0;
            totalDurationSec += act.durationSec || 0;
            totalDistanceMeters += act.distanceMeters;
            totalElevationGain += act.summary?.elevationGain || 0;

            const sport = act.sportType as keyof typeof distancePerSport;

            if (distancePerSport[sport] !== undefined) {
                distancePerSport[sport] += act.distanceMeters || 0;
                durationPerSport[sport] += act.durationSec || 0;
            }
        }

        const daysInWeek = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(safeWeekStart);
            d.setUTCDate(d.getUTCDate() + i);
            if (d <= new Date()) {
                daysInWeek.push(d.toISOString().split("T")[0]);
            }
        }

        let endingCtl = 0;
        let endingAtl = 0;
        let endingTsb = 0;

        for (const dateStr of daysInWeek) {
            if (dailyStatsMap[dateStr]) {
                endingCtl += dailyStatsMap[dateStr].ctl;
                endingAtl += dailyStatsMap[dateStr].atl;
                endingTsb += dailyStatsMap[dateStr].tsb;
                break;
            }
        }

        bulkOperations.push({
            updateOne: {
                filter: {
                    athleteId: athleteId,
                    weekStartDate: safeWeekStart,
                },
                update: {
                    $set: {
                        weekEndDate: currentWeekEnd,
                        totalTss,
                        totalWorkKj,
                        totalDurationSec,
                        totalDistanceMeters,
                        totalElevationGain,
                        activityCount: weeksActivities.length,
                        distancePerSport,
                        durationPerSport,
                        endingCtl,
                        endingAtl,
                        endingTsb,
                    },
                },
                upsert: true,
            },
        });

        currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() + 7);
    }

    if (bulkOperations.length > 0) {
        await WeeklyStatModel.bulkWrite(bulkOperations);
    }
};
