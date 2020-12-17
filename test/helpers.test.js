const {
  getTimestamp,
  generateNewID,
  getUserURLs,
  generateRandomString,
  doesEmailExist,
  validateUserCredentials,
} = require('../helpers/helpers');

test('properly generates new id', () => {
  const id = generateNewID();
  expect(id).toBe(id);
});

test('properly generates 6 chars of random string', () => {
  const length = generateRandomString().length;
  expect(length).toBe(6);
});

test('properly checks email in the database', () => {
  expect(doesEmailExist('user2@example.com')).toBe(true);
});

test('properly checks user credentials from DB', () => {
  expect(validateUserCredentials('user2@example.com', 'dishwasher-funk')).toBe(true);
  expect(validateUserCredentials('user2@example.com', 'incorrectPassword')).toBe(false);
});

test('properly checks user URLS from DB', () => {
  const userURLs = {
    pqWc5L: { longURL: 'https://www.bloomberg.com/canada', userID: 'user2@example.com' },
    SHbJto: { longURL: 'https://ca.finance.yahoo.com/', userID: 'user2@example.com' },
  };
  expect(getUserURLs('user2@example.com')).toEqual(userURLs);
});
