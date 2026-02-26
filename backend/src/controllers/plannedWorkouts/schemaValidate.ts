import Joi from "joi";
import {
    SPORT_TYPES,
    STATUS,
    STEP_TYPES,
    DURATION_TYPES,
    TARGET_TYPES,
} from "../../constants/activities";

const stepSchema = Joi.object({
    stepOrder: Joi.number().integer().required(),
    type: Joi.string()
        .valid(...STEP_TYPES)
        .required(),
    duration: Joi.object({
        type: Joi.string()
            .valid(...DURATION_TYPES)
            .required(),
        value: Joi.number().min(0).optional(),
    }).required(),
    target: Joi.object({
        type: Joi.string()
            .valid(...TARGET_TYPES)
            .required(),
        min: Joi.number().optional(),
        max: Joi.number().optional(),
        isRamp: Joi.boolean().optional(),
        startValue: Joi.number().optional(),
        endValue: Joi.number().optional(),
    }).required(),
});

const workoutStepSchema = stepSchema.keys({
    steps: Joi.array().items(stepSchema).optional(),
});

const schemaValidate = Joi.object({
    scheduledDate: Joi.date().iso().required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow("", null).optional(),
    sportType: Joi.string()
        .valid(...SPORT_TYPES)
        .required(),
    targetTss: Joi.number().min(0).max(1000).optional(),
    estimatedDurationSec: Joi.number().min(0).optional(),
    status: Joi.string()
        .valid(...STATUS)
        .optional(),
    structure: Joi.array().items(workoutStepSchema).optional(),
});

export default schemaValidate;
