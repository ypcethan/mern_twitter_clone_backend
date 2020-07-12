const Tweet = require('./tweet.model');
const User = require('../user/user.model');

exports.getAllFromUser = async (req, res, next) => {
  try {
    console.log(req.params);
    const tweets = await Tweet.find({ createdBy: req.params.userId });
    res.status(200).json({ success: true, tweets });
  } catch (error) {
    next(error);
  }
};
