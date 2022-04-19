// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export const environments = {
  PORT: process.env.PORT || 4000,
  DATABASE: process.env.DATABASE,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  CLOUD_FOLDER: process.env.CLOUD_FOLDER
}
