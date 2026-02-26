import mongoose from "mongoose";
import type { Activity } from "../types/Activity";
import { SPORT_TYPES } from "../constants/activities";

export const activityModel = new mongoose.Schema<Activity>(
    {
        athleteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        garminActivityId: String,
        title: String,
        manufacturer: String,
        sportType: { type: String, enum: SPORT_TYPES, required: true },
        startTime: Date,
        durationSec: Number,
        distanceMeters: Number,
        laps: [
            {
                lapIndex: Number,
                startTime: Date,
                durationSec: Number,
                distanceMeters: Number,
                avgPower: Number,
                maxPower: Number,
                avgHr: Number,
                maxHr: Number,
                avgCadence: Number,
                avgSpeed: Number,
            },
        ],
        summary: {
            tss: { type: Number, default: 0 },
            np: { type: Number, default: 0 },
            if: { type: Number, default: 0 },
            workKj: { type: Number, default: 0 },
            calories: { type: Number, default: 0 },
            trainingLoad: { type: Number, default: 0 },
            aerobicTe: { type: Number, default: 0 },
            anaerobicTe: { type: Number, default: 0 },
            avgHr: { type: Number, default: 0 },
            maxHr: { type: Number, default: 0 },
            avgPower: { type: Number, default: 0 },
            maxPower: { type: Number, default: 0 },
            max20MinPower: { type: Number, default: 0 },
            avgCadence: { type: Number, default: 0 },
            maxCadence: { type: Number, default: 0 },
            avgSpeed: { type: Number, default: 0 },
            maxSpeed: { type: Number, default: 0 },
            elevationGain: { type: Number, default: 0 },
            elevationLoss: { type: Number, default: 0 },
            powerCurve: {
                p1s: { type: Number, default: 0 },
                p2s: { type: Number, default: 0 },
                p5s: { type: Number, default: 0 },
                p10s: { type: Number, default: 0 },
                p20s: { type: Number, default: 0 },
                p30s: { type: Number, default: 0 },
                p60s: { type: Number, default: 0 },
                p120s: { type: Number, default: 0 },
                p300s: { type: Number, default: 0 },
                p600s: { type: Number, default: 0 },
                p1200s: { type: Number, default: 0 },
                p1800s: { type: Number, default: 0 },
                p3600s: { type: Number, default: 0 },
            },
            timeInZones: {
                hr: [{ type: Number }],
                power: [{ type: Number }],
            },
        },
        recalculateTss: Boolean,
    },
    { timestamps: true },
);

export const ActivityModel = mongoose.model("Activity", activityModel);
