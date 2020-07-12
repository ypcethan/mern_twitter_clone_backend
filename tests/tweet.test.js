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
// beforeEach(async () => {
//   await clearDatabase();
// });
afterAll(async () => {
  await closeDatabase();
});

const baseUrl = '/v1/tweets/';
let token;
beforeAll(async () => {
  await User.create(userOneData);
  const response = await request(app)
    .post('/v1/users/login')
    .send(userOneData);
  token = response.body.token;
});
describe('Create one', () => {
  test('Authenticated user can created a tweet ', async () => {
    const response = await request(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(tweetOneData)
      .expect(200);
    expect(response.tweet).not.toBeNull();
  });

  test('Unauthenticated user cannot created a tweet ', async () => {
    const response = await request(app)
      .post(baseUrl)
      .send(tweetTwoData)
      .expect(401);
    expect(response).not.toHaveProperty('tweet');
  });
});
