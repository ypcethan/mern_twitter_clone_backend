const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    next({ message: 'Not authorize for this route', statusCode: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    next({ message: 'Not authorize for this route', statusCode: 401 });
  }
};
