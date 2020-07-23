const request = require('supertest');
const server = require('../app.js');

beforeAll(async () => {
  // do something before anything else runs
  console.log('Jest starting!');
});
// close the server after each test
afterAll(() => {
  server.close();
  console.log('server closed!');
});

describe('test home', () => {
  test('get home route  GET /', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Honest Food API!');
  });
});

describe('test search', () => {
  test('get home route  POST /search', async () => {
    const response = await request(server).post('/search');
    expect(response.status).toEqual(200);
  });
});
