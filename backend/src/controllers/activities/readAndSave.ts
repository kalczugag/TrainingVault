import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { syncStravaForUser } from "../../config/strava";
import type { User } from "../../types/User";

export const fetchAndSaveActivities = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;

        const newActivitiesCount = await syncStravaForUser(userId);

        return res.status(200).json(successResponse(newActivitiesCount));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
