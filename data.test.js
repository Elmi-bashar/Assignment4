// data.test.js
const request = require('supertest');
const express = require('express');
const dataRouter = require('./api/data'); // adjust path if needed

const app = express();
app.use(express.json());
app.use('/data', dataRouter);

describe('POST /data/search', () => {

  it('should return matching records when forename exists', async () => {
    const response = await request(app)
      .post('/data/search')
      .send({ forename: 'Roy' })
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].firstname).toBe('Roy');
  });

  it('should return 404 when forename does not exist', async () => {
    const response = await request(app)
      .post('/data/search')
      .send({ forename: 'Nonexistent' })
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 415 if content type is not application/json', async () => {
    const response = await request(app)
      .post('/data/search')
      .send('forename=Roy') // not JSON
      .set('Content-Type', 'text/plain');

    expect(response.statusCode).toBe(415);
    expect(response.body.error).toBe('Unsupported Media Type. Use application/json.');
  });

  it('should return 400 if forename is missing', async () => {
    const response = await request(app)
      .post('/data/search')
      .send({})
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('forename is required.');
  });

});
