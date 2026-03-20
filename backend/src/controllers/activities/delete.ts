import express from "express";
import { isValidObjectId } from "mongoose";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";

export const deleteActivityById = async (
    req: express.Request<{ activityId: string }>,
    res: express.Response,
) => {
    try {
        const { activityId } = req.params;

        if (!isValidObjectId(activityId)) {
            return res
                .status(400)
                .json(errorResponse(null, "Invalid activity ID format", 400));
        }

        const deletedActivity =
            await ActivityModel.findByIdAndDelete(activityId);

        if (!deletedActivity) {
            return res
                .status(404)
                .json(errorResponse(null, "Activity not found", 404));
        }

        return res.status(200).json(successResponse(deletedActivity));
    } catch (err: any) {
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
