import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";
import type { User } from "../../types/User";
import { recalculatePMC } from "../../config/pmcService";

// TODO: add option to manual athleteId recalculation
export const recalculateDailyStats = async (
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

        await recalculatePMC(userId, startDate);

        return res
            .status(200)
            .json(
                successResponse(
                    null,
                    `Successfully recalculated daily stats from ${startDate.toISOString().split("T")[0]}`,
                ),
            );
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Error recalculating daily stats", 500));
    }
};
