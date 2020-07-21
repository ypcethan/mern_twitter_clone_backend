const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
require('dotenv').config();
const { protect } = require('../middleware/auth');
const {
  register, login, updateOne, getOne, getAuth,
  getFollowedUsers, createFollow, getMany,
  getRecommandedToFollow,
} = require('../controllers/user.controller');

const router = express.Router();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename(req, file, cb) {
//     cb(null, `${new Date().toISOString()}__${file.originalname}`);
//   },
// });
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024, // 1MB
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
//       return cb(new Error('Please upload an image'));
//     }
//     return cb(null, true);
//   },
// });

const awsS3 = new aws.S3({});
const storage = multerS3({
  s3: awsS3,
  acl: 'public-read',
  bucket: 'mern-twitter',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}__${file.originalname}`);
  },
});
const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Please upload an image'));
    }
    return cb(null, true);
  },
  storage,
});

router.post('/register', register);
router.post('/login', login);
router.patch('/:id', protect, upload.any(), updateOne);
router.get('/auth', protect, getAuth);
router.get('/followed', protect, getFollowedUsers);
router.post('/followed/:otherUserId', protect, createFollow);
router.get('/recommanded', protect, getRecommandedToFollow);
router.get('/:userName', getOne);
router.get('/', getMany);

module.exports = router;
