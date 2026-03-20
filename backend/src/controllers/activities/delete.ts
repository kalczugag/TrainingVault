import express from "express";
import { isValidObjectId } from "mongoose";
import { successResponse, errorResponse } from "../../handlers/apiResponse";
import { ActivityModel } from "../../models/Activity";
import { ActivityStreamModel } from "../../models/ActivityStream";
import { WeeklyStatModel } from "../../models/WeeklyStat";
import { recalculatePMC } from "../../config/pmcService";

export const deleteActivityById = async (
    req: express.Request<{ activityId: string }>,
    res: express.Response,
) => {
    try {
        const { activityId } = req.params;

        if (!isValidObjectId(activityId)) {
            return res
                .status(400)
                .json(errorResponse(null, "Invalid activity ID format", 400));
        }

        const deletedActivity =
            await ActivityModel.findByIdAndDelete(activityId);

        if (!deletedActivity) {
            return res
                .status(404)
                .json(errorResponse(null, "Activity not found", 404));
        }

        await ActivityStreamModel.deleteMany({
            "metadata.activityId": activityId,
        });

        const userId = deletedActivity.athleteId;
        const activityDate = new Date(deletedActivity.startTime);

        await WeeklyStatModel.findOneAndUpdate(
            {
                athleteId: userId,
                weekStartDate: { $lte: activityDate },
                weekEndDate: { $gte: activityDate },
            },
            {
                $inc: {
                    totalDistanceMeters: -(deletedActivity.distanceMeters || 0),
                    totalDurationSec: -(deletedActivity.durationSec || 0),
                    totalTss: -(deletedActivity.summary?.tss || 0),
                    totalWorkKj: -(deletedActivity.summary?.workKj || 0),
                    totalElevationGain: -(
                        deletedActivity.summary?.elevationGain || 0
                    ),
                    activityCount: -1,
                    distancePerSport: {
                        [deletedActivity.sportType]: -(
                            deletedActivity.distanceMeters || 0
                        ),
                    },
                    durationPerSport: {
                        [deletedActivity.sportType]: -(
                            deletedActivity.durationSec || 0
                        ),
                    },
                },
            },
        );

        await recalculatePMC(userId!.toString(), activityDate);

        return res.status(200).json(successResponse(deletedActivity));
    } catch (err: any) {
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
