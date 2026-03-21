import express from "express";
import axios from "axios";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { getValidStravaToken } from "../../config/strava";
import type { User } from "../../types/User";
import { ActivityStreamModel } from "../../models/ActivityStream";
import { ActivityModel } from "../../models/Activity";

export const fetchAndSaveActivityStream = async (
    req: express.Request<{ dbActivityId: string }>,
    res: express.Response,
) => {
    try {
        const { dbActivityId } = req.params;
        const userId = (req.user as User)._id;

        const streamExists = await ActivityStreamModel.find({
            "metadata.activityId": dbActivityId,
        }).sort({ timestamp: 1 });

        if (streamExists && streamExists.length > 0) {
            return res
                .status(200)
                .json(
                    successResponse(
                        streamExists,
                        "Stream fetched from database",
                    ),
                );
        }

        const activity = await ActivityModel.findOne({
            _id: dbActivityId,
            athleteId: userId,
        });

        if (!activity) {
            return res
                .status(404)
                .json(errorResponse(null, "Activity not found", 404));
        }

        if (!activity.stravaActivityId) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        null,
                        "This activity is not linked to Strava (missing stravaActivityId)",
                        400,
                    ),
                );
        }

        const token = await getValidStravaToken(userId.toString());
        const headers = { Authorization: `Bearer ${token}` };

        const keys =
            "time,latlng,distance,altitude,velocity_smooth,heartrate,cadence,watts";
        const [streamRes, lapsRes] = await Promise.all([
            axios
                .get(
                    `https://www.strava.com/api/v3/activities/${activity.stravaActivityId}/streams`,
                    {
                        headers,
                        params: { keys, key_by_type: true },
                    },
                )
                .catch(() => ({ data: {} })),
            axios
                .get(
                    `https://www.strava.com/api/v3/activities/${activity.stravaActivityId}/laps`,
                    {
                        headers,
                    },
                )
                .catch(() => ({ data: [] })),
        ]);

        const stravaStreams = streamRes.data || {};
        const stravaLaps = lapsRes.data || [];

        const sMap: Record<string, any[]> = {};

        if (Array.isArray(stravaStreams)) {
            stravaStreams.forEach((s: any) => {
                sMap[s.type] = s.data;
            });
        } else if (typeof stravaStreams === "object") {
            Object.keys(stravaStreams).forEach((key) => {
                sMap[key] = stravaStreams[key].data || [];
            });
        }

        const timeArr = sMap.time || [];
        const activityDate = new Date(activity.startTime);

        let streamDataToInsert: any[] = [];
        if (timeArr.length > 0) {
            streamDataToInsert = timeArr.map((t: number, i: number) => ({
                timestamp: new Date(activityDate.getTime() + t * 1000),
                metadata: {
                    activityId: dbActivityId,
                    athleteId: userId,
                },
                measurements: {
                    watts: sMap.watts?.[i] || 0,
                    hr: sMap.heartrate?.[i] || 0,
                    cadence: sMap.cadence?.[i] || 0,
                    speedKmh: sMap.velocity_smooth?.[i]
                        ? Number((sMap.velocity_smooth[i] * 3.6).toFixed(2))
                        : 0,
                    altitude: sMap.altitude?.[i] || 0,
                    lat: sMap.latlng?.[i]?.[0] || null,
                    lng: sMap.latlng?.[i]?.[1] || null,
                },
            }));

            const BATCH_SIZE = 1000;
            for (let i = 0; i < streamDataToInsert.length; i += BATCH_SIZE) {
                await ActivityStreamModel.insertMany(
                    streamDataToInsert.slice(i, i + BATCH_SIZE),
                    { ordered: false },
                );
            }
        }

        if (stravaLaps.length > 0) {
            const lapsToInsert = stravaLaps.map((lap: any) => ({
                lapIndex: lap.lap_index,
                startTime: lap.start_date,
                durationSec: lap.elapsed_time || 0,
                distanceMeters: lap.distance || 0,
                avgPower: lap.average_watts || 0,
                maxPower: lap.max_watts || 0,
                avgHr: lap.average_heartrate || 0,
                maxHr: lap.max_heartrate || 0,
                avgCadence: lap.average_cadence || 0,
                avgSpeed: lap.average_speed || 0,
            }));

            await ActivityModel.findByIdAndUpdate(
                dbActivityId,
                { $set: { laps: lapsToInsert } },
                { new: true },
            );
        }

        return res
            .status(200)
            .json(
                successResponse(
                    streamDataToInsert,
                    "Stream synchronized successfully from Strava",
                ),
            );
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
