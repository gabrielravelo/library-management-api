import * as Joi from 'joi';

export const envSchema = Joi.object({
    ENV            : Joi.string().required(),
    PORT           : Joi.number().required(),
    DB_HOST        : Joi.string().required(),
    DB_USER        : Joi.string().required(),
    DB_PASSWORD    : Joi.string().required(),
    DB_NAME        : Joi.string().required(),
    DB_PORT        : Joi.number().required(),
    JWT_KEY        : Joi.string().required(),
    JWT_EXPIRES_IN : Joi.string().default('1h'),
});

