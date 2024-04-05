import * as dotenv from "dotenv";
import * as joi from "joi";

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

const schemaValidate = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid("development", "staging", "production")
      .required(),
    REDIS_URL: joi.string(),
    REDIS_HOST: joi.string(),
    REDIS_PORT: joi.number(),
    REDIS_PASSWORD: joi.string(),
    PORT: joi.number().required(),
    MONGO_URL: joi.string().required()
  })
  .unknown()
  .required();

const { error, value: envVars } = schemaValidate.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export const config = {
  port: envVars.PORT ?? 8081,
  NODE_ENV: envVars.NODE_ENV,
  MONGO_URL: envVars.MONGO_URL,
  redis: {
    HOST: envVars.REDIS_HOST,
    PORT: envVars.REDIS_PORT,
    PASSWORD: envVars.REDIS_PASSWORD
  }
};
