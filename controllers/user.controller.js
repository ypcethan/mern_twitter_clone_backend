const User = require('../models/user.model');

// @desc      Register new user
// @route     POST /v1/users/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    // await validateUserNameAndEmail(req, res);
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ sucess: false, message: 'Email is already been taken' });
    }
    user = await User.findOne({ userName: req.body.userName });
    if (user) {
      return res.status(400).json({ sucess: false, message: 'User name is already been taken' });
    }
    user = await User.create(req.body);
    const token = user.getJwtToken();
    // res.status(200).json({ sucess: true, user, token });
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

// @desc      Login user
// @route     POST /v1/users/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist with that email' });
    }
    if (!(await user.matchPassword(req.body.password))) {
      return res.status(401).json({ success: false, message: 'Password does not match' });
    }
    const token = await user.getJwtToken();
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

// @desc      Update user
// @route     PATCH /v1/users/:id
// @access    Private
exports.updateOne = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist' });
    }
    if (req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to this route' });
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // Update any uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === 'coverImage') {
          user.coverImage = file.path;
        } else if (file.fieldname === 'avatar') {
          user.avatar = file.path;
        }
      });
      // user.avatar = req.file.path;
      await user.save();
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc      Get single user by userName
// @route     GET /v1/users/:userName
// @access    Public
exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findOne({ userName: req.params.userName });
    if (!user) {
      res.status(400).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc      Get user data from client's valid token
// @route     GET /v1/users/auth
// @access    Private
exports.getAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
