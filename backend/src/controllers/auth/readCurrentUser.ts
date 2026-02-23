import express from "express";
import { errorResponse } from "../../handlers/apiResponse";
import { User } from "../../types/User";

export const getCurrentUser = async (
    req: express.Request,
    res: express.Response,
) => {
    const cacheKey = res.locals.cacheKey;

    const user = req.user as User;

    try {
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(errorResponse(null, "Internal server error"));
    }
};
