import express from "express";
import { errorResponse } from "../../handlers/apiResponse";
import { validPassword, issueJWT } from "../../utils/helpers";
import { UserModel } from "../../models/User";

export const login = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json(errorResponse(null, "Missing credentials", 400));
    }

    try {
        const existingUser = await UserModel.findOne({ email })
            .select("+hash +salt +refreshToken")
            .exec();

        if (!existingUser) {
            return res
                .status(401)
                .json(errorResponse(null, "Invalid credentials", 401));
        }

        const isMatch = validPassword(
            password,
            existingUser.hash!,
            existingUser.salt!,
        );

        if (!isMatch) {
            return res
                .status(401)
                .json(errorResponse(null, "Invalid credentials", 401));
        }

        const accessToken = issueJWT(existingUser, "access");
        const refreshToken = issueJWT(existingUser, "refresh");

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        res.cookie("refreshToken", refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: refreshToken.expiresInMs,
        });

        return res.status(200).json({
            success: true,
            userId: existingUser._id,
            role: existingUser.role,
            email: existingUser.email,
            ...accessToken,
        });
    } catch (err: any) {
        console.error(err.message);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
