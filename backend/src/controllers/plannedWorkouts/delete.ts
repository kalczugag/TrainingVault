import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { PlannedWorkoutModel } from "../../models/PlannedWorkout";
import type { User } from "../../types/User";

export const deletePlannedWorkout = async (
    req: express.Request<{ id: string }>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { id } = req.params;

        const deletedWorkout = await PlannedWorkoutModel.findOneAndDelete({
            _id: id,
            athleteId: userId,
        });

        if (!deletedWorkout) {
            return res
                .status(404)
                .json(errorResponse(null, "Workout not found", 404));
        }

        return res
            .status(200)
            .json(successResponse(null, "Workout deleted successfully"));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
