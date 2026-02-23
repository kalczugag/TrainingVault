import mongoose from "mongoose";
import type { DailyStat } from "../types/DailyStat";

export const dailyStatModel = new mongoose.Schema<DailyStat>({
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: Date,
    dailyTss: Number,
    pmc: {
        ctl: Number,
        atl: Number,
        tsb: Number,
    },
});

export const DailyStatModel = mongoose.model("DailyStat", dailyStatModel);
