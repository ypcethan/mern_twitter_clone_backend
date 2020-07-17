const express = require('express');
const {
  getAllFromUser, createOne, getOne, updateOne, deleteOne, getReleventTweets,
  createComment, getAllComments,
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
router.post('/:id/comments', protect, createComment);
router.get('/:id/comments', getAllComments);
module.exports = router;
