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
});
const chatSchema = mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  history: [
    responseSchema,
  ],
});

module.exports = mongoose.model('Chat', chatSchema);
