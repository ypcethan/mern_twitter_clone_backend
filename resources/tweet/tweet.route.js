const express = require('express');
const { getAllFromUser } = require('./tweet.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// router.get('/', getAll);
// router.get('/:id', getOne);
router.get('/:userId/tweets/', protect, getAllFromUser);

module.exports = router;
