import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { PlannedWorkoutModel } from "../../models/PlannedWorkout";
import type { User } from "../../types/User";
import type { PlannedWorkout } from "../../types/PlannedWorkout";

export const createPlannedWorkout = async (
    req: express.Request<{}, {}, PlannedWorkout>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const workoutData = req.body;

        const newWorkout = await PlannedWorkoutModel.create({
            ...workoutData,
            athleteId: userId,
            createdBy: userId,
        });

        return res
            .status(200)
            .json(successResponse(newWorkout, "Workout created successfully"));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
