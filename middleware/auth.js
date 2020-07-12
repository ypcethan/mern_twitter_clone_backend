const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  console.log(token);
  next();
};
