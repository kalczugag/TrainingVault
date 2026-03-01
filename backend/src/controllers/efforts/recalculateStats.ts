import express from "express";
import { recalculateAllUserStats } from "../../config/garmin";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import type { User } from "../../types/User";

export const recalculateUserStats = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;

        const result = await recalculateAllUserStats(userId);

        return res.status(200).json(successResponse(result));
    } catch (error: any) {
        console.error(error);
        return res
            .status(500)
            .json(
                errorResponse(
                    null,
                    "An error occurred while recalculating stats",
                ),
            );
    }
};
