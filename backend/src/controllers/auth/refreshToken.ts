import express from "express";
import jwt from "jsonwebtoken";
import ms from "ms";
import { errorResponse } from "../../handlers/apiResponse";
import { issueJWT } from "../../utils/helpers";
import { UserModel } from "../../models/User";

export const refreshToken = async (
    req: express.Request,
    res: express.Response,
) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.refreshToken) {
        return res
            .status(403)
            .json(errorResponse(null, "Refresh token required", 403));
    }

    let token = cookies.refreshToken;

    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!,
        ) as jwt.JwtPayload;

        const user = await UserModel.findById(decoded.sub)
            .select("+refreshToken")
            .exec();

        if (!user) {
            return res
                .status(401)
                .json(errorResponse(null, "User not found", 401));
        }

        if (user.refreshToken?.token !== token) {
            return res
                .status(403)
                .json(errorResponse(null, "Invalid refresh token", 403));
        }

        const accessToken = issueJWT(user, "access");
        const newRefreshToken = issueJWT(user, "refresh");

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: newRefreshToken.expiresInMs,
        });

        return res.status(200).json({
            success: true,
            userId: user._id,
            role: user.role,
            email: user.email,
            ...accessToken,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(401)
            .json(errorResponse(null, "Invalid or expired refresh token", 401));
    }
};
