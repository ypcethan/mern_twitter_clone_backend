const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
  content: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const chatSchema = mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  history: [
    responseSchema,
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
