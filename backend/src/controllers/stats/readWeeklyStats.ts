import express from "express";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { WeeklyStatModel } from "../../models/WeeklyStat";
import type { User } from "../../types/User";

interface WeeklyStatsQueryParams {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
}

export const readWeeklyStats = async (
    req: express.Request<{}, {}, {}, WeeklyStatsQueryParams>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { startDate, endDate, page, limit } = req.query;

        const query: any = { athleteId: userId };

        if (startDate && endDate) {
            query.weekStartDate = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }

        const currentPage = parseInt(page as string) || 1;
        const currentLimit = parseInt(limit as string) || 10;
        const skip = (currentPage - 1) * currentLimit;

        const [weeklyStats, totalCount] = await Promise.all([
            WeeklyStatModel.find(query)
                .sort({ weekStartDate: 1 })
                .skip(skip)
                .limit(currentLimit)
                .lean(),
            WeeklyStatModel.countDocuments(query),
        ]);

        const hasMore = skip + weeklyStats.length < totalCount;
        const nextCursor = hasMore ? currentPage + 1 : undefined;

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
