import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../handlers/apiResponse";
import schema from "../controllers/plannedWorkouts/schemaValidate";

export const validatePlannedWorkout = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
    });

    if (error) {
        const errorMessage = error.details.map((d) => d.message).join(", ");
        return res
            .status(400)
            .json(
                errorResponse(null, `Validation error: ${errorMessage}`, 400),
            );
    }

    req.body = value;
    next();
};
