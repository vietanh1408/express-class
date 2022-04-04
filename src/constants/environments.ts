require("dotenv").config();

export const environments = {
  PORT: process.env.PORT || 4000,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  SECRET_TOKEN: process.env.SECRET_TOKEN,
};
