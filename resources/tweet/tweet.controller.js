const Tweet = require('./tweet.model');
const User = require('../user/user.model');

exports.getAllFromUser = async (req, res, next) => {
  try {
    const tweets = await Tweet.find({ createdBy: req.body.userId });
    res.status(200).json({ success: true, tweets });
  } catch (error) {
    next(error);
  }
};
