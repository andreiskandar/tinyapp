const chai = require('chai');
const assert = chai.assert;
const { doesEmailExist, validateUserCredentials, getUserURLs } = require('../helpers/helpers');

describe('#doesEmailExist()', () => {
  it('should return a true when given existing valid email from user database', () => {
    const actual = doesEmailExist('user2@example.com');
    const expectedOutput = true;
    assert.equal(actual, expectedOutput);
  });

  it('should return a false when given non-existing email from user database', () => {
    const actual = doesEmailExist('nonExistingEmail@example.com');
    const expectedOutput = false;
    assert.equal(actual, expectedOutput);
  });
});

describe('#validateUserCredentials()', () => {
  it('should return a true when given valid password', () => {
    const actual = validateUserCredentials('user2@example.com', 'dishwasher-funk');
    const expectedOutput = true;
    assert.equal(actual, expectedOutput);
  });

  it('should return a false when given email and password are unmatched', () => {
    const actual = validateUserCredentials('user2@example.com', 'incorrectPassword');
    const expectedOutput = false;
    assert.equal(actual, expectedOutput);
  });
});

describe('#getUserURLs()', () => {
  it('should return an expected url object when given a user', () => {
    const actual = getUserURLs('user@example.com');
    const expectedOutput = {
      b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'user@example.com' },
      i3BoGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
      i3BsGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
    };
    assert.deepEqual(actual, expectedOutput);
  });

  // test with invalid user
});
