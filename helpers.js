const alphanumeric = require('alphanumeric-id');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const { users, urlDatabase } = require('./sampleDatabase');
// const users = {
// 	userRandomID: {
// 		id: 'userRandomID',
// 		email: 'user@example.com',
// 		// password: 'purple-monkey-dinosaur',
// 		password: '$2a$10$mRA0PJmaZUXtGuDmGeISg.f0LqvbbfAm1zRNRwFSFCk85FaULZhX6',
// 	},
// 	user2RandomID: {
// 		id: 'user2RandomID',
// 		email: 'user2@example.com',
// 		// password: 'dishwasher-funk',
// 		password: '$2a$10$drF4E9kLAsNW18wTmuGBtuTxmhb2ydfFuxyKMxJ7Qf1bo/psRMVPG',
// 	},
// };

// const ERROR_MESSAGE = {
// 	no_email_and_password: 'Please enter an email or password',
// 	issue_with_email_password: 'There is an issue with the email or password',
// 	account_does_not_exist: 'Account does not exist. Please register a new account',
// };

// const urlDatabase = {
// 	b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'user@example.com' },
// 	i3BoGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
// 	pqWc5L: { longURL: 'https://www.bloomberg.com/canada', userID: 'user2@example.com' },
// 	SHbJto: { longURL: 'https://ca.finance.yahoo.com/', userID: 'user2@example.com' },
// 	i3Bfsr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
// };
// };

const generateNewID = () => {
	return uuid().split('-')[1];
};

const generateRandomString = () => {
	return alphanumeric(6);
};

const doesEmailExist = (newEmail) => {
	//return users[id][newEmail]
	const emailDB = Object.keys(users).map((id) => users[id].email);
	return emailDB.includes(newEmail);
};

const validateUserCredentials = (userEmail, userPassword) => {
	for (const id in users) {
		if (users[id].email === userEmail && bcrypt.compareSync(userPassword, users[id].password)) {
			return true;
		}
	}
	return false;
};

const getUserURLs = (email) => {
	const userURLObj = {};
	for (const url in urlDatabase) {
		if (urlDatabase[url].userID === email) {
			userURLObj[url] = urlDatabase[url];
		}
	}
	return userURLObj;
};

module.exports = {
	generateNewID,
	generateRandomString,
	doesEmailExist,
	validateUserCredentials,
	getUserURLs,
};
