const chai = require('chai');
const assert = chai.assert;
const { doesEmailExist, validatePassword, getUserURLDatabase } = require('../helpers');

describe('#doesEmailExist()', () => {
	it('should return a true when given existing valid email from user database', () => {
		const actual = doesEmailExist('user2@example.com');
		const expectedOutput = true;
		assert.equal(actual, expectedOutput);
	});

	it('should return a false when given non-existing email from user database', () => {
		const actual = doesEmailExist('nonexisting@example.com');
		const expectedOutput = false;
		assert.equal(actual, expectedOutput);
	});
});

describe('#validatePassword()', () => {
	it('should return a true when given valid password', () => {
		const actual = validatePassword('user2@example.com', 'dishwasher-funk');
		const expectedOutput = true;
		assert.equal(actual, expectedOutput);
	});

	it('should return a false when given email and password are unmatched', () => {
		const actual = validatePassword('user2@example.com', 'incorrectPassword');
		const expectedOutput = false;
		assert.equal(actual, expectedOutput);
	});
});

describe('#getUserURLDatabase()', () => {
	it('should return an expected url object when given a user', () => {
		const actual = getUserURLDatabase('user@example.com');
		const expectedOutput = {
			b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'user@example.com' },
			i3BoGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
			i3Bfsr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
		};
		assert.deepEqual(actual, expectedOutput);
	});
});
