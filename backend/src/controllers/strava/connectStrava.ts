import express from "express";
import axios from "axios";
import { errorResponse, successResponse } from "../../handlers/apiResponse";
import { UserModel } from "../../models/User";
import type { User } from "../../types/User";

export const connectStrava = async (
    req: express.Request<{}, {}, { code: string }>,
    res: express.Response,
) => {
    const { code } = req.body;
    const userId = (req.user as User)._id;

    try {
        const response = await axios.post(
            "https://www.strava.com/oauth/token",
            {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
            },
        );

        const stravaId = response.data.athlete.id.toString();

        await UserModel.findByIdAndUpdate(userId, { stravaId });

        return res
            .status(200)
            .json(successResponse(null, "Strava connected successfully"));
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
