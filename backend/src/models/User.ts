import mongoose from "mongoose";
import type { User, ZoneConfig, ZoneItem } from "../types/User";
import {
    USER_ROLES,
    UNIT_SYSTEMS,
    START_OF_WEEK_OPTIONS,
    CALCULATION_METHODS,
} from "../constants/user";
import { SPORT_TYPES } from "../constants/activities";

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

const zoneItemSchema = new mongoose.Schema<ZoneItem>(
    {
        name: { type: String, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
    },
    { _id: false },
);

const zoneConfigSchema = new mongoose.Schema<ZoneConfig>(
    {
        isCustom: { type: Boolean, default: false },
        calculationMethod: {
            type: String,
            enum: CALCULATION_METHODS,
            default: "maxHr",
        },
        zones: { type: [zoneItemSchema], default: [] },
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
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        primarySport: { type: String, enum: SPORT_TYPES, required: true },
        birthDate: { type: Date, required: true },
        garminCredentials: {
            type: garminCredentialsSchema,
            select: false,
        },
        stravaId: {
            type: String,
            unique: true,
            sparse: true,
        },
        metrics: {
            weightKg: { type: Number, default: 0 },
            maxHr: { type: Number, default: 0 },
            restHr: { type: Number, default: 0 },
        },
        thresholdHistory: [
            {
                effectiveFrom: { type: Date, required: true },
                ftp: Number,
                lthr: Number,
            },
        ],
        zones: {
            hr: { type: zoneConfigSchema, default: () => ({}) },
            power: {
                type: zoneConfigSchema,
                default: () => ({ calculationMethod: "ftp" }),
            },
        },
        preferences: {
            unitSystem: { type: String, enum: UNIT_SYSTEMS, default: "metric" },
            startOfWeek: {
                type: String,
                enum: START_OF_WEEK_OPTIONS,
                default: "monday",
            },
        },
        hash: { type: String, select: false },
        salt: { type: String, select: false },
        refreshToken: {
            type: refreshTokenSchema,
            select: false,
        },
    },
    { timestamps: true },
);

userModel.index({ username: 1, email: 1 }, { unique: true });

export const UserModel = mongoose.model("User", userModel);
