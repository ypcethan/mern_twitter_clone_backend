const request = require('supertest');
const { app } = require('../server');
const User = require('../resources/user/user.model');
const Tweet = require('../resources/tweet/tweet.model');
const { connect, clearDatabase, closeDatabase } = require('./test-db-setup');

const { userOneData, userTwoData } = require('./fixture/user.fixture');
const { tweetOneData, tweetThreeData, tweetTwoData } = require('./fixture/tweet.fixture');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});
afterAll(async () => {
  await closeDatabase();
});

const baseUrl = '/v1/tweets/';
describe('Create one', () => {
  let token;
  beforeEach(async () => {
    await User.create(userOneData);
    const response = await request(app)
      .post('/v1/users/login')
      .send(userOneData);
    token = response.body.token;
  });
  test('Authenticated user can created a tweet ', async () => {
    const response = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(tweetOneData)
      .expect(200);
    expect(response.body.tweet).not.toBeNull();
  });

  test('Unauthenticated user cannot created a tweet ', async () => {
    const response = await request(app)
      .post(baseUrl)
      .send(tweetTwoData)
      .expect(401);
    expect(response.body).not.toHaveProperty('tweet');
  });
});

describe('Update one', () => {
  let tweetOneId;
  let tweetTwoId;
  let token;
  beforeEach(async () => {
    const user = await User.create(userOneData);
    const userTwo = await User.create(userTwoData);
    const tweetTwo = await Tweet.create({ ...tweetTwoData, createdBy: userTwo._id });
    tweetTwoId = tweetTwo._id;
    const tweet = await Tweet.create({ ...tweetOneData, createdBy: user._id });
    tweetOneId = tweet._id;
    const response = await request(app)
      .post('/v1/users/login')
      .send(userOneData);
    token = response.body.token;
  });
  test('User can update her own tweet', async () => {
    const response = await request(app)
      .patch(`${baseUrl}${tweetOneId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(tweetTwoData)
      .expect(200);
    expect(response.body.tweet).not.toBeNull();
    expect(response.body.tweet.content).toBe(tweetTwoData.content);
  });

  test('User cannot update tweet that is not hers', async () => {
    await request(app)
      .patch(`${baseUrl}${tweetTwoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(tweetOneData)
      .expect(401);
  });
});

describe('Can add comment to a tweet', () => {
  let tweetOneId;
  let tweetTwoId;
  let token;
  let user;
  beforeEach(async () => {
    user = await User.create(userOneData);
    const userTwo = await User.create(userTwoData);
    const tweetTwo = await Tweet.create({ ...tweetTwoData, createdBy: userTwo._id });
    tweetTwoId = tweetTwo._id;
    const tweet = await Tweet.create({ ...tweetOneData, createdBy: user._id });
    tweetOneId = tweet._id;
    const response = await request(app)
      .post('/v1/users/login')
      .send(userOneData);
    token = response.body.token;
  });
  test('Can add comment to a tweet', async () => {
    const commentData = {
      content: 'new comment',
    };
    await request(app)
      .post(`${baseUrl}${tweetTwoId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send(commentData)
      .expect(200);
    const response = await request(app)
      .get(`${baseUrl}${tweetTwoId}/comments`)
      .expect(200);
    const comment = response.body.comments[0];
    expect(comment.content).toBe(commentData.content);
    expect(comment.createdBy.toString()).toBe(user._id.toString());
  });
});
