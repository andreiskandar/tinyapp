const alphanumeric = require('alphanumeric-id');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const { users, urlDatabase } = require('./sampleDatabase');

const generateNewID = () => {
	return uuid().split('-')[1];
};

const generateRandomString = () => {
	return alphanumeric(6);
};

const doesEmailExist = (newEmail) => {
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
	getUserURLs,
	generateRandomString,
	doesEmailExist,
	validateUserCredentials,
};
