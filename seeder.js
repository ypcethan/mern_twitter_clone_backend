const mongoose = require('mongoose');
const faker = require('faker');
const colors = require('colors');
const dotenv = require('dotenv');
// Load env vars
dotenv.config({ path: './config/dev.env' });

// Load models
const Tweet = require('./models/tweet.model');
const User = require('./models/user.model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// const idOne = mongoose.Types.ObjectId();
// const idTwo = mongoose.Types.ObjectId();
// const users = [
//   {
//     _id: idOne,
//     name: 'atrina',
//     email: 'atrina@gmail.com',
//     password: 'asdfasdf',
//   },

//   {
//     _id: idTwo,
//     name: 'ethan',
//     email: 'ethan@gmail.com',
//     password: 'asdfasdf',
//   },
// ];

// const tweets = [
//   {
//     content: 'T1',
//     createdBy: idTwo,
//   },
//   {
//     content: 'T2',
//     createdBy: idTwo,
//   },
//   {
//     content: 'T3',
//     createdBy: idTwo,
//   },
// ];

const createUsers = (numberOfUser = 10) => {
  const users = [];
  for (let i = 0; i < numberOfUser; i++) {
    const user = {
      name: faker.name.findName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.image(),
    };
    users.push(user);
  }
  return users;
};

const createTweets = (users, numberOfTweetsPerUser = 5) => {
  const tweets = [];
  users.forEach((user) => {
    for (let i = 0; i < numberOfTweetsPerUser; i++) {
      const newTweet = {
        content: faker.lorem.text(),
        createdBy: user._id,
      };
      tweets.push(newTweet);
    }
  });
  return tweets;
};
// Import into DB
const importData = async () => {
  try {
    // await User.create(users);
    // await Tweet.create(tweets);
    let users = createUsers(10);
    users = await User.create(users);
    let tweets = createTweets(users);
    tweets = await Tweet.create(tweets);
    console.log(tweets);
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
