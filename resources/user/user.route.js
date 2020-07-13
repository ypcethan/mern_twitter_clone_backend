const express = require('express');

const { request } = require('express');
const { protect } = require('../../middleware/auth');
const { register, login, updateOne } = require('./user.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/:id', protect, updateOne);

module.exports = router;
