import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import os from "os";
import AdmZip from "adm-zip";
import FitParser from "fit-file-parser";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { parseFitFile } from "../../utils/helpers";
import { ActivityModel } from "../../models/Activity";
import { UserModel } from "../../models/User";
import { getGarminClient } from "../../config/garmin";
import type { User } from "../../types/User";

type FormatType = "fit" | "gpx" | "tcx" | "csv";

export const exportActivity = async (
    req: Request<{ id: string; format: FormatType }>,
    res: Response,
) => {
    let exportDir = "";

    try {
        const userId = (req.user as User)._id;
        const { id, format } = req.params;
        const lowerFormat = format.toLowerCase();

        const activity = await ActivityModel.findOne({
            _id: id,
            athleteId: userId,
        });
        if (!activity) {
            return res
                .status(404)
                .json(errorResponse(null, "Activity not found", 404));
        }

        const safeTitle = activity.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();

        if (lowerFormat === "csv") {
            const user =
                await UserModel.findById(userId).select("+garminCredentials");
            if (!user || !user.garminCredentials) {
                return res
                    .status(400)
                    .json(
                        errorResponse(
                            null,
                            "Garmin credentials not found",
                            400,
                        ),
                    );
            }

            const garminClient = await getGarminClient(
                user._id,
                user.garminCredentials,
            );
            const garminActivityObj = {
                activityId: Number(activity.garminActivityId),
            };

            exportDir = path.join(
                os.tmpdir(),
                `garmin_export_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            );
            fs.mkdirSync(exportDir, { recursive: true });

            await garminClient.downloadOriginalActivityData(
                garminActivityObj,
                exportDir,
                "zip",
            );

            const files = fs.readdirSync(exportDir);
            if (files.length === 0) {
                return res.status(500).json({
                    success: false,
                    message: "Garmin did not return file",
                });
            }

            const downloadedFilePath = path.join(exportDir, files[0]);
            const zip = new AdmZip(downloadedFilePath);
            const fitEntry = zip
                .getEntries()
                .find((entry) =>
                    entry.entryName.toLowerCase().endsWith(".fit"),
                );

            if (!fitEntry) {
                return res
                    .status(500)
                    .json(
                        errorResponse(
                            null,
                            "Garmin did not return FIT file",
                            404,
                        ),
                    );
            }

            const fitBuffer = fitEntry.getData();

            const parsedData = await parseFitFile(fitBuffer);
            const records = parsedData.records || [];

            if (records.length === 0) {
                return res
                    .status(404)
                    .json(errorResponse(null, "Activity has no timeline", 404));
            }

            const headersSet = new Set<string>();
            records.forEach((r: any) =>
                Object.keys(r).forEach((k) => headersSet.add(k)),
            );
            const headers = Array.from(headersSet);

            const rows = records.map((record: any) => {
                return headers
                    .map((header) => {
                        const val = record[header];
                        if (val instanceof Date) return val.toISOString();
                        if (typeof val === "object") return "";
                        return val !== undefined && val !== null ? val : "";
                    })
                    .join(",");
            });

            const csvContent = [headers.join(","), ...rows].join("\n");

            if (!csvContent) {
                return res
                    .status(404)
                    .json(errorResponse(null, "Activity has no timeline", 404));
            }

            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${safeTitle}_timeline.csv"`,
            );
            return res.send(csvContent);
        }

        if (["fit", "gpx", "tcx"].includes(lowerFormat)) {
            const user =
                await UserModel.findById(userId).select("+garminCredentials");
            if (!user || !user.garminCredentials) {
                return res
                    .status(400)
                    .json(
                        errorResponse(
                            null,
                            "User has no Garmin credentials",
                            400,
                        ),
                    );
            }

            const garminClient = await getGarminClient(
                user._id,
                user.garminCredentials,
            );

            const garminActivityObj = {
                activityId: Number(activity.garminActivityId),
            };

            exportDir = path.join(
                os.tmpdir(),
                `garmin_export_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            );
            fs.mkdirSync(exportDir, { recursive: true });

            const garminType = (lowerFormat === "fit" ? "zip" : lowerFormat) as
                | "zip"
                | "gpx"
                | "tcx";

            await garminClient.downloadOriginalActivityData(
                garminActivityObj,
                exportDir,
                garminType,
            );

            const files = fs.readdirSync(exportDir);
            if (files.length === 0) {
                return res
                    .status(500)
                    .json(errorResponse(null, "File not found"));
            }

            const downloadedFilePath = path.join(exportDir, files[0]);

            if (garminType === "zip") {
                const zip = new AdmZip(downloadedFilePath);
                const zipEntries = zip.getEntries();

                const fitEntry = zipEntries.find((entry) =>
                    entry.entryName.toLowerCase().endsWith(".fit"),
                );
                if (!fitEntry) {
                    return res
                        .status(500)
                        .json(errorResponse(null, "Fit file not found"));
                }

                const fitBuffer = fitEntry.getData();

                res.setHeader("Content-Type", "application/vnd.ant.fit");
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${safeTitle}.fit"`,
                );
                return res.send(fitBuffer);
            } else {
                const fileBuffer = fs.readFileSync(downloadedFilePath);
                const contentType =
                    lowerFormat === "gpx"
                        ? "application/gpx+xml"
                        : "application/vnd.garmin.tcx+xml";

                res.setHeader("Content-Type", contentType);
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${safeTitle}.${lowerFormat}"`,
                );
                return res.send(fileBuffer);
            }
        }

        return res.status(400).json(errorResponse(null, "Invalid format", 400));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error"));
    } finally {
        if (exportDir && fs.existsSync(exportDir)) {
            fs.rmSync(exportDir, { recursive: true, force: true });
        }
    }
};
