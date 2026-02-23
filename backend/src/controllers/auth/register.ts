import express from "express";
import ms from "ms";
import { errorResponse } from "../../handlers/apiResponse";
import { genPassword, issueJWT } from "../../utils/helpers";
import { UserModel } from "../../models/User";
import schema from "./schemaValidate";

interface RegisterRequestBody {
    email: string;
    password: string;
    role?: string;
    coachId?: string;
}

export const register = async (
    req: express.Request<{}, {}, RegisterRequestBody>,
    res: express.Response,
) => {
    const { error } = schema.validate(req.body);

    if (error) {
        return res
            .status(400)
            .json(
                errorResponse(
                    null,
                    error.details.map((detail) => detail.message).join(", "),
                    400,
                ),
            );
    }

    const { password } = req.body;

    try {
        const { salt, hash } = genPassword(password);

        const newUser = new UserModel({
            ...req.body,
            hash,
            salt,
        });

        await newUser.save();

        const accessToken = issueJWT(newUser, "access");
        const refreshToken = issueJWT(newUser, "refresh");

        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.cookie("refreshToken", refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: refreshToken.expiresInMs,
        });

        return res.status(201).json({
            success: true,
            userId: newUser._id,
            role: newUser.role,
            email: newUser.email,
            ...accessToken,
        });
    } catch (err: any) {
        if (err.message?.includes("duplicate key")) {
            return res
                .status(409)
                .json(
                    errorResponse(
                        null,
                        "User with this email already exists",
                        409,
                    ),
                );
        }
        console.error(err);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error", 500));
    }
};
