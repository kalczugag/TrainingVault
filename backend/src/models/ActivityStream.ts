import mongoose from "mongoose";
import type { ActivityStream } from "../types/ActivityStream";

const activityStreamSchema = new mongoose.Schema<ActivityStream>(
    {
        timestamp: { type: Date, required: true },
        metadata: {
            activityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Activity",
                required: true,
            },
            athleteId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
        measurements: {
            watts: Number,
            hr: Number,
            cadence: Number,
            speedKmh: Number,
            altitude: Number,
            lat: Number,
            lng: Number,
        },
    },
    {
        _id: false,
        timeseries: {
            timeField: "timestamp",
            metaField: "metadata",
            granularity: "seconds",
        },
    },
);

activityStreamSchema.index({ "metadata.activityId": 1, timestamp: 1 });

export const ActivityStreamModel = mongoose.model(
    "ActivityStream",
    activityStreamSchema,
);
