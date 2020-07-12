const Tweet = require('./tweet.model');
const User = require('../user/user.model');
const { tweetTwoData } = require('../../tests/fixture/tweet.fixture');

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

exports.getOne = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    let tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ success: false, message: 'Tweet with given id does not exist' });
    }
    if (tweet.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'No authorize for this route' });
    }
    tweet = await Tweet.findByIdAndUpdate(req.params.id, req.body,
      {
        new: true,
        runValidators: true,
      });
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    next(error);
  }
};
exports.deleteOne = async (req, res, next) => {
  try {
    let tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ success: false, message: 'Tweet with given id does not exist' });
    }
    if (tweet.createdBy.toString() !== req.user._id) {
      return res.status(401).json({ success: false, message: 'No authorize for this route' });
    }
    tweet = await Tweet.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    next(error);
  }
};
