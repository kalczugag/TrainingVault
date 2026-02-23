import mongoose from "mongoose";
import type { Activity } from "../types/Activity";
import { SPORT_TYPES } from "constants/activities";

export const activityModel = new mongoose.Schema<Activity>({
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    garminActivityId: String,
    title: String,
    sportType: { type: String, enum: SPORT_TYPES, required: true },
    startTime: Date,
    durationSec: Number,
    distanceMeters: Number,
    summary: {
        tss: Number,
        np: Number,
        if: Number,
        workKj: Number,
        avgPower: Number,
        maxPower: Number,
        avgHr: Number,
        maxHr: Number,
        avgCadence: Number,
        elevationGain: Number,
    },
    recalculateTss: Boolean,
});

export const ActivityModel = mongoose.model("Activity", activityModel);
