import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";
import type { User } from "../../types/User";
import { recalculatePMC } from "../../config/pmcService";
import { recalculateWeeklyStats } from "../../config/weeklyStatService";

// TODO: add option to manual athleteId recalculation
export const recalculateDailyAndWeeklyStats = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;

        const oldestActivity = await ActivityModel.findOne({
            athleteId: userId,
        })
            .sort({ startTime: 1 })
            .select("startTime")
            .lean();

        let startDate: Date;

        if (oldestActivity && oldestActivity.startTime) {
            startDate = oldestActivity.startTime;
        } else {
            startDate = new Date();
        }

        await recalculatePMC(userId.toString(), startDate);

        await recalculateWeeklyStats(userId.toString(), startDate);

        return res
            .status(200)
            .json(
                successResponse(
                    null,
                    `Successfully recalculated daily and weekly stats from ${startDate.toISOString().split("T")[0]}`,
                ),
            );
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Error recalculating daily stats", 500));
    }
};
