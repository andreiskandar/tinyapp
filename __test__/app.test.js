const request = require('supertest');
const app = require('../app');

describe('Test root path', () => {
  test('It should response the GET method', () => {
    return request(app)
      .get('/')
      .then((res) => {
        expect(res.statusCode).toBe(302);
      });
  });
});

describe('Test /urls path', () => {
  test('It should response the GET method then redirect to /urls', () => {
    return request(app)
      .get('/urls')
      .then((res) => {
        console.log('res body message', res.body.message);
        expect(res.statusCode).toBe(200);
      });
  });
});
