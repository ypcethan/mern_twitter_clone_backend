const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
// Load env vars
dotenv.config({ path: './config/dev.env' });

// Load models
const Tweet = require('./resources/tweet/tweet.model');
const User = require('./resources/user/user.model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const idOne = mongoose.Types.ObjectId();
const idTwo = mongoose.Types.ObjectId();
const users = [
  {
    _id: idOne,
    name: 'atrina',
    email: 'atrina@gmail.com',
    password: 'asdfasdf',
  },

  {
    _id: idTwo,
    name: 'ethan',
    email: 'ethan@gmail.com',
    password: 'asdfasdf',
  },
];

const tweets = [
  {
    content: 'T1',
    createdBy: idTwo,
  },
  {
    content: 'T2',
    createdBy: idTwo,
  },
  {
    content: 'T3',
    createdBy: idTwo,
  },
];
// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Tweet.create(tweets);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Tweet.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
