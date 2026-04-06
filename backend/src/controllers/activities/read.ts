import express from "express";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";
import type { User } from "../../types/User";

interface ActivityQueryParams {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
}

export const readActivities = async (
    req: express.Request<{}, {}, {}, ActivityQueryParams>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { startDate, endDate } = req.query;

        const query: any = { athleteId: userId };

        if (startDate && endDate) {
            query.startTime = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const safeLimit = Math.min(limit, 100);
        const skip = (page - 1) * safeLimit;

        const [activities, totalCount] = await Promise.all([
            ActivityModel.find(query)
                .sort({ startTime: -1 })
                .skip(skip)
                .limit(safeLimit)
                .lean(),
            ActivityModel.countDocuments(query),
        ]);

        const hasMore = skip + activities.length < totalCount;
        const nextCursor = hasMore ? page + 1 : undefined;

        return res
            .status(200)
            .json(
                successResponse(
                    activities,
                    "Activities retrieved successfully",
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
