const express = require('express');

const router = express.Router();
const controller = require('./user.controller');

router.route('/')
  .post(controller.register);
module.exports = router;
