import express from "express";
import { syncGarminForUser } from "../../config/garmin";
import { UserModel } from "../../models/User";

export const stravaWebhook = async (
    req: express.Request<
        {},
        {},
        { object_type: string; aspect_type: string; owner_id: string }
    >,
    res: express.Response,
) => {
    const { object_type, aspect_type, owner_id } = req.body;

    res.status(200).send("EVENT_RECEIVED");

    if (object_type === "activity" && aspect_type === "create") {
        try {
            const user = await UserModel.findOne({
                stravaId: owner_id.toString(),
            });

            if (user) {
                syncGarminForUser(user._id).catch((err) => console.error(err));
            } else {
                console.error("User not found");
            }
        } catch (err: any) {
            console.error(err.message);
        }
    }
};
