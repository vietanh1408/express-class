require("dotenv").config();

export const environments = {
  PORT: process.env.PORT || 4000,
  DATABASE: process.env.DATABASE,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  SECRET_TOKEN: process.env.SECRET_TOKEN,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
};
