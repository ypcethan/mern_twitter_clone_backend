const path = require('path');
const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

const app = express();
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(__dirname, 'config/dev.env') });
  app.use(logger('dev'));
}

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json('Hello');
});
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

module.exports = { start, app };
