import mongoose from "mongoose";
import type { WeeklyStat } from "../types/WeeklyStat";

export const weeklyStatModel = new mongoose.Schema<WeeklyStat>({
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
    totalTss: { type: Number, default: 0 },
    totalDistanceMeters: { type: Number, default: 0 },
    totalDurationSec: { type: Number, default: 0 },
    totalWorkKj: { type: Number, default: 0 },
    totalElevationGain: { type: Number, default: 0 },
    endingAtl: { type: Number, default: 0 },
    endingTsb: { type: Number, default: 0 },
    endingCtl: { type: Number, default: 0 },
    activityCount: { type: Number, default: 0 },
    distancePerSport: {
        cycling: { type: Number, default: 0 },
        running: { type: Number, default: 0 },
        swimming: { type: Number, default: 0 },
    },
    durationPerSport: {
        cycling: { type: Number, default: 0 },
        running: { type: Number, default: 0 },
        swimming: { type: Number, default: 0 },
    },
});

weeklyStatModel.index({ athleteId: 1, weekStartDate: 1 }, { unique: true });

export const WeeklyStatModel = mongoose.model("WeeklyStat", weeklyStatModel);
