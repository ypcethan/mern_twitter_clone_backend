const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please add a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 5,
    select: false,
  },
},
{ timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } else {
    next();
  }
});

userSchema.methods.matchPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.getJwtToken = function () {
  const payload = { userID: this._id };
  const token = jwt.sign(payload, process.env.JWT_SECRECT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};
module.exports = mongoose.model('User', userSchema);
