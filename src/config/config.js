require("dotenv").config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  mongoPassword: process.env.MONGODB_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtCookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
};

export default config;
