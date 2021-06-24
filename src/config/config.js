import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  dbConfig: process.env.MONGO_URL,
  JWTSecret: process.env.JWTSecret,
  nodemailerConfig: {
    host: process.env.HOST,
    port: process.env.NODEMAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.PASS,
    },
  },
};
