import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { PlannedWorkoutModel } from "../../models/PlannedWorkout";
import type { User } from "../../types/User";

export const updatePlannedWorkout = async (
    req: express.Request<{ id: string }>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { id } = req.params;

        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.athleteId;
        delete updateData.createdBy;

        const updatedWorkout = await PlannedWorkoutModel.findOneAndUpdate(
            { _id: id, athleteId: userId },
            { $set: updateData },
            { new: true, runValidators: true },
        );

        if (!updatedWorkout) {
            return res
                .status(404)
                .json(errorResponse(null, "Workout not found", 404));
        }

        return res
            .status(200)
            .json(
                successResponse(updatedWorkout, "Workout updated successfully"),
            );
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
