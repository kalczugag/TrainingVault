import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";
import type { User } from "../../types/User";

export const readActivities = async (
    req: Request<{}, {}, {}, { page: string; limit: string }>,
    res: Response,
) => {
    try {
        const userId = (req.user as User)._id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const safeLimit = Math.min(limit, 100);
        const skip = (page - 1) * safeLimit;

        const [activities, totalCount] = await Promise.all([
            ActivityModel.find({ athleteId: userId })
                .sort({ startTime: -1 })
                .skip(skip)
                .limit(safeLimit)
                .lean(),
            ActivityModel.countDocuments({ athleteId: userId }),
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
