const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
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

const tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  comments: [
    commentSchema,
  ],
  likedBy: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  ],
},
{ timestamps: true });

tweetSchema.methods.toggleLikedBy = async function (userId) {
  if (this.likedBy.includes(userId)) {
    this.likedBy = this.likedBy.filter((id) => id.toString() !== userId.toString());
  } else {
    this.likedBy.push(userId);
  }
  await this.save();
};
module.exports = mongoose.model('Tweet', tweetSchema);
