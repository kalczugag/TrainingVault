import express from "express";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { WeeklyStatModel } from "../../models/WeeklyStat";
import type { User } from "../../types/User";

export const readWeeklyStats = async (
    req: express.Request<{}, {}, {}, { page: string; limit: string }>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const [weeklyStats, totalCount] = await Promise.all([
            WeeklyStatModel.find({ athleteId: userId })
                .sort({ weekStartDate: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            WeeklyStatModel.countDocuments({ athleteId: userId }),
        ]);

        const hasMore = skip + weeklyStats.length < totalCount;
        const nextCursor = hasMore ? page + 1 : undefined;

        return res
            .status(200)
            .json(
                successResponse(
                    weeklyStats,
                    "Weekly Stats retrieved successfully",
                    200,
                    totalCount,
                    hasMore,
                    nextCursor,
                ),
            );
    } catch (err: any) {
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
