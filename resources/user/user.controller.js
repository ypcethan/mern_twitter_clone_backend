const User = require('./user.model');

exports.register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ sucess: false, message: 'Email is already been taken' });
    }
    user = await User.create(req.body);
    const token = user.getJwtToken();
    res.status(200).json({ sucess: true, user, token });
  } catch (error) {
    next(error);
  }
};

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
    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    // console.log('REq');
    // console.log(req.params);
    console.log(req.file);
    // console.log(req.body);
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
    user.avatar = req.file.path;
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
