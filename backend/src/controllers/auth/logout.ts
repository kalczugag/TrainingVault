import express from "express";
import { errorResponse } from "../../handlers/apiResponse";
import { UserModel } from "../../models/User";

export const logout = async (req: express.Request, res: express.Response) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.refreshToken) {
        return res
            .status(403)
            .json(errorResponse(null, "Refresh token required", 403));
    }

    const refreshToken = cookies.refreshToken;

    try {
        const foundUser = await UserModel.findOne({
            "refreshToken.token": refreshToken,
        }).exec();

        if (!foundUser) {
            console.warn(`Invalid refresh token provided: ${refreshToken}`);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            return res
                .status(401)
                .json(errorResponse(null, "Invalid refresh token", 401));
        }

        await UserModel.updateOne(
            { "refreshToken.token": refreshToken },
            { $set: { refreshToken: null } },
        );

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json("Logged out successfully");
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error"));
    }
};
