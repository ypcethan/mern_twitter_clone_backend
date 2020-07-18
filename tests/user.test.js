const request = require('supertest');
const { app } = require('../server');
const User = require('../models/user.model');
const { connect, clearDatabase, closeDatabase } = require('./test-db-setup');

const { userOneData, userTwoData } = require('./fixture/user.fixture');

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clearDatabase();
});
afterAll(async () => {
  await closeDatabase();
});

const baseUrl = '/v1/users';
describe('Register', () => {
  test('Should be able to register user and password should be hashed', async () => {
    await request(app)
      .post(`${baseUrl}/register`)
      .send(userOneData)
      .expect(200);
    const user = await User.findOne({ email: userOneData.email });
    expect(user).not.toBeNull();
    expect(user.password).not.toBe(userOneData.password);
  });

  test('Should not be able to register user if email is already been taken', async () => {
    await User.create(userOneData);
    await request(app)
      .post(`${baseUrl}/register`)
      .send(userOneData)
      .expect(400);
  });
  test('Should not be able to register user if user name is already been taken', async () => {
    await User.create(userOneData);
    const response = await request(app)
      .post(`${baseUrl}/register`)
      .send({ ...userTwoData, userName: userOneData.userName })
      .expect(400);
  });
});

describe('Login user', () => {
  beforeEach(async () => {
    await User.create(userOneData);
  });
  test('Should be able to login with correct email and password', async () => {
    const response = await request(app)
      .post(`${baseUrl}/login`)
      .send(userOneData)
      .expect(200);
    expect(response.body).toHaveProperty('token');
  });
  test('Should not be able to login with correct email but incorrect password', async () => {
    const response = await request(app)
      .post(`${baseUrl}/login`)
      .send({ ...userOneData, password: '123' })
      .expect(401);
    expect(response.body).not.toHaveProperty('token');
  });
});

describe('Update user', () => {
  let token;
  let userOne;
  beforeEach(async () => {
    userOne = await User.create(userOneData);
    const response = await request(app)
      .post(`${baseUrl}/login`)
      .send(userOneData);
    token = response.body.token;
  });
  test('Should be able to update own profile', async () => {
    const newData = { name: 'New name', email: 'newemail@gmail.com' };
    await request(app)
      .patch(`${baseUrl}/${userOne._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(200);
    const updatedUserOne = await User.findById(userOne._id);
    expect(updatedUserOne.name).toBe(newData.name);
    expect(updatedUserOne.email).toBe(newData.email);
  });
  test("Should not be able to update others' profile", async () => {
    const newData = { name: 'New name', email: 'newemail@gmail.com' };
    await request(app)
      .patch(`${baseUrl}/${userOne._id}`)
      .send(newData)
      .expect(401);
    const updatedUserOne = await User.findById(userOne._id);
    expect(updatedUserOne.name).toBe(userOne.name);
    expect(updatedUserOne.email).toBe(userOne.email);
  });
});
