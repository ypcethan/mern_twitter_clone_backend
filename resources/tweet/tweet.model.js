const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
},
{ timestamps: true });

module.exports = mongoose.model('Tweet', tweetSchema);
