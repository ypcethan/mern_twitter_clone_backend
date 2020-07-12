const express = require('express');
const { getAllFromUser, createOne } = require('./tweet.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// router.get('/', getAll);
// router.get('/:id', getOne);
router.get('/:userId/tweets/', getAllFromUser);
router.post('/', protect, createOne);

module.exports = router;
