import mongoose from 'mongoose';
import config from '../config/config';
console.log('**********************', config.dbConfig);
mongoose.connect(`mongodb:${config.dbConfig}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to mongo db');
});
module.exports = mongoose;
