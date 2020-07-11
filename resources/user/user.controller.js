const User = require('./user.model');

exports.register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ sucess: false, message: 'Email is already been taken' });
    }
    user = await User.create(req.body);
    res.status(200).json({ sucess: true, user });
  } catch (error) {
    next(error);
  }
};
