const express = require('express');
const {
  getAllFromUser, createOne, getOne, updateOne, deleteOne, getReleventTweets,
  createComment, getAllComments, createLike, getAllUserComments, getAllUserLikes,
} = require('../controllers/tweet.controller');
const { protect } = require('../middleware/auth');

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
router.post('/:id/likes', protect, createLike);
router.get('/user/:userId/comments', getAllUserComments);
router.get('/user/:userId/likes', getAllUserLikes);
module.exports = router;
