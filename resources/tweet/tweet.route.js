const express = require('express');
const {
  getAllFromUser, createOne, getOne, updateOne, deleteOne,
} = require('./tweet.controller');
const { protect } = require('../../middleware/auth');
const { route } = require('../user/user.route');

const router = express.Router();

// router.get('/', getAll);
// router.get('/:id', getOne);
router.get('/:userId/tweets/', getAllFromUser);
router.post('/', protect, createOne);
router.get('/:id', getOne);
router.patch('/:id', protect, updateOne);
router.delete('/:id', protect, deleteOne);
module.exports = router;
