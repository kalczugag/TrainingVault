import mongoose from "mongoose";
import type { DailyStat } from "../types/DailyStat";

export const dailyStatModel = new mongoose.Schema<DailyStat>({
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: { type: Date, required: true },
    dailyTss: { type: Number, default: 0 },
    dailyWorkKj: { type: Number, default: 0 },
    dailyDurationSec: { type: Number, default: 0 },
    dailyDistanceMeters: { type: Number, default: 0 },
    dailyElevationGain: { type: Number, default: 0 },
    ctl: { type: Number, default: 0 },
    atl: { type: Number, default: 0 },
    tsb: { type: Number, default: 0 },
});

dailyStatModel.index({ athleteId: 1, date: 1 }, { unique: true });

export const DailyStatModel = mongoose.model("DailyStat", dailyStatModel);
