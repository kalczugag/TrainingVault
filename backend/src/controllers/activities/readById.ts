import express from "express";
import { isValidObjectId } from "mongoose";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";
import type { User } from "../../types/User";

export const readActivities = async (
    req: express.Request<{ activityId: string }>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { activityId } = req.params;

        if (!isValidObjectId(activityId)) {
            return res
                .status(400)
                .json(errorResponse(null, "Invalid activity ID format", 400));
        }

        const activity = await ActivityModel.findById(activityId);

        if (!activity) {
            return res
                .status(404)
                .json(errorResponse(null, "Activity not found", 404));
        }

        return res.status(200).json(successResponse(activity));
    } catch (err: any) {
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
