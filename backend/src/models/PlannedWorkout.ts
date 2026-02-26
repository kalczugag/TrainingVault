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

stepWorkoutSchema.add({
    steps: {
        type: [stepWorkoutSchema],
        default: undefined,
    },
});

export const plannedWorkoutModel = new mongoose.Schema<PlannedWorkout>(
    {
        athleteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        scheduledDate: { type: Date, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        sportType: { type: String, enum: SPORT_TYPES, required: true },
        targetTss: { type: Number, default: 0 },
        estimatedDurationSec: { type: Number, default: 0 },
        status: { type: String, enum: STATUS, default: "scheduled" },
        structure: [stepWorkoutSchema],
    },
    { timestamps: true },
);

plannedWorkoutModel.index({ athleteId: 1, scheduledDate: 1 });

export const PlannedWorkoutModel = mongoose.model(
    "PlannedWorkout",
    plannedWorkoutModel,
);
