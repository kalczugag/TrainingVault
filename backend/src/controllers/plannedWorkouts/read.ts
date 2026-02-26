import express from "express";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { PlannedWorkoutModel } from "../../models/PlannedWorkout";
import type { User } from "../../types/User";

export const readPlannedWorkouts = async (
    req: express.Request<{}, {}, {}, { startDate: string; endDate: string }>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { startDate, endDate } = req.query;

        const query: any = { athleteId: userId };

        if (startDate && endDate) {
            query.scheduledDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const workouts = await PlannedWorkoutModel.find(query)
            .sort({ scheduledDate: 1 })
            .lean();

        return res.status(200).json(successResponse(workouts));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
