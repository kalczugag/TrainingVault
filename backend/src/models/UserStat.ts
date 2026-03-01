import mongoose from "mongoose";
import type { UserStat, Effort } from "../types/UserStat";

const effortSchema = new mongoose.Schema<Effort>(
    {
        value: { type: Number, required: true },
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
        },
        garminActivityId: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { _id: false },
);

const userStatSchema = new mongoose.Schema<UserStat>(
    {
        athleteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        cycling: {
            powerCurve: {
                p1s: { type: [effortSchema], default: [] },
                p5s: { type: [effortSchema], default: [] },
                p20s: { type: [effortSchema], default: [] },
                p60s: { type: [effortSchema], default: [] },
                p300s: { type: [effortSchema], default: [] },
                p1200s: { type: [effortSchema], default: [] },
                p3600s: { type: [effortSchema], default: [] },
            },
            distances: {
                d10k: { type: [effortSchema], default: [] },
                d20k: { type: [effortSchema], default: [] },
                d30k: { type: [effortSchema], default: [] },
                d50k: { type: [effortSchema], default: [] },
                d100k: { type: [effortSchema], default: [] },
            },
            elevation: {
                biggestClimb: { type: [effortSchema], default: [] },
                maxElevationGain: { type: [effortSchema], default: [] },
            },
            longestRide: { type: [effortSchema], default: [] },
        },
    },
    { timestamps: true },
);

export const UserStatModel = mongoose.model("UserStat", userStatSchema);
