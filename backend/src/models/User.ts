import mongoose from "mongoose";
import type { User } from "../types/User";
import { USER_ROLES } from "../constants/user";

const refreshTokenSchema = new mongoose.Schema<User["refreshToken"]>(
    {
        token: { type: String, required: true },
        expires: { type: String, required: true },
    },
    { _id: false },
);

const garminCredentialsSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        passwordEncrypted: { type: String, required: true },
        iv: { type: String, required: true },
    },
    { _id: false },
);

export const userModel = new mongoose.Schema<User>(
    {
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: USER_ROLES, default: "athlete" },
        coachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        garminCredentials: {
            type: garminCredentialsSchema,
            select: false,
        },
        metrics: {
            weightKg: Number,
            maxHr: Number,
            restHr: Number,
        },
        thresholdHistory: [
            {
                effectiveFrom: Date,
                ftp: Number,
                lthr: Number,
            },
        ],
        hash: { type: String, select: false },
        salt: { type: String, select: false },
        refreshToken: {
            type: refreshTokenSchema,
            select: false,
        },
    },
    { timestamps: true },
);

export const UserModel = mongoose.model("User", userModel);
