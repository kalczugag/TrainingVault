import express from "express";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { parseFitFile } from "../../utils/helpers";
import { getGarminClient } from "../../config/garmin";
import type { User } from "../../types/User";
import { UserModel } from "../../models/User";
import { ActivityStreamModel } from "../../models/ActivityStream";
import { ActivityModel } from "../../models/Activity";

export const fetchAndSaveActivityStream = async (
    req: express.Request<
        { dbActivityId: string },
        {},
        { garminActivityId: string }
    >,
    res: express.Response,
) => {
    try {
        const { dbActivityId } = req.params;
        const { garminActivityId } = req.body;
        const userId = (req.user as User)._id;

        const streamExists = await ActivityStreamModel.exists({
            "metadata.activityId": dbActivityId,
        });

        if (streamExists) {
            return res
                .status(400)
                .json(errorResponse(null, "Stream already exists"));
        }

        const user = await UserModel.findById(userId)
            .select("+garminCredentials")
            .exec();

        if (!user || !user.garminCredentials) {
            return res.status(404).json(errorResponse(null, "User not found"));
        }

        const garminClient = await getGarminClient(
            user._id,
            user.garminCredentials,
        );

        const downloadDir = path.resolve(__dirname, "../../files");

        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        const zipBuffer = await garminClient.downloadOriginalActivityData(
            { activityId: Number(garminActivityId) },
            downloadDir,
        );

        const zipFilePath = path.join(downloadDir, `${garminActivityId}.zip`);

        if (!fs.existsSync(zipFilePath)) {
            return res
                .status(404)
                .json(errorResponse(null, "File not found", 404));
        }

        const zip = new AdmZip(zipFilePath);
        const zipEntries = zip.getEntries();

        const fitEntry = zipEntries.find((entry) =>
            entry.entryName.toLocaleLowerCase().endsWith(".fit"),
        );

        if (!fitEntry) {
            fs.unlinkSync(zipFilePath);

            return res
                .status(404)
                .json(errorResponse(null, "Invalid FIT file", 404));
        }

        const fitBuffer = fitEntry.getData();

        const parsedData = await parseFitFile(fitBuffer);

        if (!parsedData || parsedData.records.length === 0) {
            return res
                .status(400)
                .json(errorResponse(null, "Invalid FIT file", 400));
        }

        const streamDataToInsert = parsedData.records.map((record: any) => ({
            timestamp: record.timestamp,
            metadata: {
                activityId: dbActivityId,
                athleteId: userId,
            },
            measurements: {
                watts: record.power || 0,
                hr: record.heart_rate || 0,
                cadence: record.cadence || 0,
                speedKmh: record.speed || 0,
                altitude: record.altitude || 0,
                lat: record.position_lat || null,
                lng: record.position_long || null,
            },
        }));

        await ActivityStreamModel.insertMany(streamDataToInsert, {
            ordered: false,
        });

        if (parsedData.laps && parsedData.laps.length > 0) {
            const lapsToInsert = parsedData.laps.map(
                (lap: any, index: number) => ({
                    lapIndex: index + 1,
                    startTime: lap.start_time,
                    durationSec:
                        lap.total_timer_time || lap.total_elapsed_time || 0,
                    distanceMeters: lap.total_distance || 0,
                    avgPower: lap.avg_power || 0,
                    maxPower: lap.max_power || 0,
                    avgHr: lap.avg_heart_rate || 0,
                    maxHr: lap.max_heart_rate || 0,
                    avgCadence: lap.avg_cadence || 0,
                    avgSpeed: lap.avg_speed || 0,
                }),
            );

            await ActivityModel.findByIdAndUpdate(dbActivityId, {
                $set: { laps: lapsToInsert },
            });
        }

        fs.unlinkSync(zipFilePath);

        return res.status(200).json(successResponse(null));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
