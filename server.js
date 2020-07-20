const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const connectDB = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./routes/user.route');
const tweetRouter = require('./routes/tweet.route');
const Chat = require('./models/chat.model');

const app = express();
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, 'config/dev.env') });
  app.use(logger('dev'));
} else {
  dotenv.config({ path: path.resolve(__dirname, 'config/prod.env') });
}
// Middleware

app.use(cors());
// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Mounting router
app.use('/twitter/v1/users', userRouter);
app.use('/twitter/v1/tweets', tweetRouter);

app.get('/twitter', (req, res) => {
  res.json('Hello');
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIO(server, { origins: '*:*' });
io.on('connection', (socket) => {
  socket.on('join', async ({ room }, callback) => {
    socket.join(room);
    const chat = await Chat.findOne({ room });
    if (!chat) {
      await Chat.create({ room });
    } else {
      socket.emit('message', chat.history);
    }
    callback();
  });

  socket.on('sendMessage', async (data) => {
    const {
      content, createdBy, room, userName,
    } = data;
    let chat = await Chat.findOne({ room });
    chat.history.push({
      content,
      createdBy,
      userName,
    });
    chat = await chat.save();
    io.in(room).emit('message', { ...chat.history[chat.history.length - 1]._doc });
  });

  // socket.on('disconnect', () => {
  //   console.log('A user has left');
  // });
});

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

module.exports = { start, app };
