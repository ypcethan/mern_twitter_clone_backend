const Tweet = require('./tweet.model');
const User = require('../user/user.model');

// @desc      Get all relevant tweets for authenticated user
// @route     GET /v1/tweets/
// @access    Private
exports.getReleventTweets = async (req, res, next) => {
  try {
    // const tweets = await Tweet.find({ createdBy: req.user._id }, null, { sort: '-updatedAt' }).populate({
    //   path: 'createdBy',
    // });
    const tweets = await Tweet.find(null, null, { sort: '-updatedAt' }).populate({
      path: 'createdBy',
    });
    res.status(200).json({ success: true, tweets });
  } catch (error) {
    next(error);
  }
};
// @desc      Get all tweets from a single user
// @route     GET /v1/tweets/:userId/tweets/
// @access    Public
exports.getAllFromUser = async (req, res, next) => {
  try {
    const tweets = await Tweet.find({ createdBy: req.params.userId });
    res.status(200).json({ success: true, tweets });
  } catch (error) {
    next(error);
  }
};
// @desc      Create a single tweet
// @route     POST /v1/tweets/
// @access    Private
exports.createOne = async (req, res, next) => {
  try {
    let tweet = await Tweet.create({ ...req.body, createdBy: req.user._id });
    tweet = await tweet.populate('createdBy').execPopulate();
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    next(error);
  }
};

// @desc      Get a single tweet by ID
// @route     GET /v1/tweets/:id
// @access    Public
exports.getOne = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    next(error);
  }
};

// @desc      Update a single tweet by ID
// @route     PATCH /v1/tweets/:id
// @access    Private
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
// @desc      Delete a single tweet by ID
// @route     Delete /v1/tweets/:id
// @access    Private
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
