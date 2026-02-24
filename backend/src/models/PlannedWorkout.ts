import mongoose from "mongoose";
import type { PlannedWorkout, WorkoutStep } from "../types/PlannedWorkout";
import {
    STEP_TYPES,
    DURATION_TYPES,
    TARGET_TYPES,
    STATUS,
    SPORT_TYPES,
} from "../constants/activities";

const stepWorkoutSchema = new mongoose.Schema<WorkoutStep>(
    {
        stepOrder: { type: Number, required: true },
        type: { type: String, enum: STEP_TYPES, required: true },
        duration: {
            type: { type: String, enum: DURATION_TYPES, required: true },
            value: Number,
        },
        target: {
            type: { type: String, enum: TARGET_TYPES, required: true },
            min: Number,
            max: Number,
            isRamp: Boolean,
            startValue: Number,
            endValue: Number,
        },
    },
    { _id: false },
);

export const plannedWorkoutModel = new mongoose.Schema<PlannedWorkout>(
    {
        athleteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        scheduledDate: Date,
        title: String,
        sportType: { type: String, enum: SPORT_TYPES, required: true },
        targetTss: Number,
        status: { type: String, enum: STATUS, required: true },
        structure: stepWorkoutSchema,
    },
    { timestamps: true },
);

export const PlannedWorkoutModel = mongoose.model(
    "PlannedWorkout",
    plannedWorkoutModel,
);
