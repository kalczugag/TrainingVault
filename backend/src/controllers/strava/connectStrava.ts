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

        const { access_token, refresh_token, expires_at, athlete } =
            response.data;
        const stravaId = athlete.id.toString();

        const existingUser = await UserModel.findOne({
            stravaId: stravaId,
            _id: { $ne: userId },
        });

        if (existingUser) {
            return res
                .status(409)
                .json(
                    errorResponse(null, "Strava account already in use", 409),
                );
        }

        await UserModel.findByIdAndUpdate(userId, {
            $set: {
                stravaId: stravaId,
                stravaCredentials: {
                    stravaAccessToken: access_token,
                    stravaRefreshToken: refresh_token,
                    stravaTokenExpiresAt: expires_at,
                },
            },
        });

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
