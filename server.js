const path = require('path');
const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./resources/user/user.route');
const tweetRouter = require('./resources/tweet/tweet.route');

const app = express();
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, 'config/dev.env') });
  app.use(logger('dev'));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());
// Mounting router
app.use('/v1/users', userRouter);
app.use('/v1/tweets', tweetRouter);

app.get('/', (req, res) => {
  res.json('Hello');
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

module.exports = { start, app };
