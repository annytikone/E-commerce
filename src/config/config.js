import dotenv from 'dotenv';

dotenv.config();
const dbConfig = process.env.MONGO_URL;
module.exports = { dbConfig };
