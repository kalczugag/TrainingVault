import Joi from "joi";

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().optional(),
    coachId: Joi.string().optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.date().required(),
    username: Joi.string().required(),
    primarySport: Joi.string().required(),
    garminCredentials: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).optional(),
    stravaId: Joi.string().optional(),
    metrics: {
        weightKg: Joi.number().optional(),
        maxHr: Joi.number().optional(),
        restHr: Joi.number().optional(),
    },
    thresholdHistory: Joi.array()
        .items(
            Joi.object({
                effectiveFrom: Joi.date().required(),
                ftp: Joi.number().required(),
                lthr: Joi.number().required(),
            }),
        )
        .optional(),
});

export default schema;
