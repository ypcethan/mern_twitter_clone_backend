const express = require('express');
const {
  getAllFromUser, createOne, getOne, updateOne, deleteOne, getReleventTweets,
} = require('./tweet.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// router.get('/', getAll);
// router.get('/:id', getOne);
router.get('/:userId/tweets/', getAllFromUser);
router.get('/', protect, getReleventTweets);
router.post('/', protect, createOne);
router.get('/:id', getOne);
router.patch('/:id', protect, updateOne);
router.delete('/:id', protect, deleteOne);
module.exports = router;
