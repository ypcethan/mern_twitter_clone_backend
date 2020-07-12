const Tweet = require('./tweet.model');
const User = require('../user/user.model');

exports.getAllFromUser = async (req, res, next) => {
  try {
    const tweets = await Tweet.find({ createdBy: req.params.userId });
    res.status(200).json({ success: true, tweets });
  } catch (error) {
    next(error);
  }
};

exports.createOne = async (req, res, next) => {
  try {
    const tweet = await Tweet.create({ ...req.body, createdBy: req.user._id });
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    next(error);
  }
};
