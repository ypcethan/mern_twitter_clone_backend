const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  register, login, updateOne, getOne, getAuth,
  getFollowedUsers, createFollow,
} = require('../controllers/user.controller');

const router = express.Router();
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString()}__${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Please upload an image'));
    }
    return cb(null, true);
  },
});

router.post('/register', register);
router.post('/login', login);
router.patch('/:id', protect, upload.any(), updateOne);
router.get('/auth', protect, getAuth);
router.get('/followed', protect, getFollowedUsers);
router.post('/followed/:otherUserId', protect, createFollow);
router.get('/:userName', getOne);

module.exports = router;
