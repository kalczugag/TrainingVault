import express from "express";
import { processStravaActivity } from "../../config/strava";
import { recalculatePMC } from "../../config/pmcService";
import { UserModel } from "../../models/User";

export const stravaWebhook = async (
    req: express.Request<
        {},
        {},
        {
            object_type: string;
            aspect_type: string;
            owner_id: string;
            object_id: string;
        }
    >,
    res: express.Response,
) => {
    const { object_type, aspect_type, owner_id, object_id } = req.body;

    console.log(
        `Event received ${object_type} ${aspect_type} from user ${owner_id}`,
    );

    res.status(200).send("EVENT_RECEIVED");

    if (object_type === "activity" && aspect_type === "create") {
        try {
            const user = await UserModel.findOne({
                stravaId: owner_id.toString(),
            });

            if (user) {
                console.log("user found");

                const result = await processStravaActivity(
                    object_id,
                    user._id.toString(),
                );

                if (result.status === "created" && result.date) {
                    await recalculatePMC(user._id.toString(), result.date);
                }
            } else {
                console.error("User not found");
            }
        } catch (err: any) {
            console.error(err.message);
        }
    }
};
