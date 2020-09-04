const users = {
	userRandomID: {
		id: 'userRandomID',
		email: 'user@example.com',
		// password: 'purple-monkey-dinosaur',
		password: '$2a$10$mRA0PJmaZUXtGuDmGeISg.f0LqvbbfAm1zRNRwFSFCk85FaULZhX6', // for helpersTest.js
	},
	user2RandomID: {
		id: 'user2RandomID',
		email: 'user2@example.com',
		// password: 'dishwasher-funk',
		password: '$2a$10$drF4E9kLAsNW18wTmuGBtuTxmhb2ydfFuxyKMxJ7Qf1bo/psRMVPG', // for helpersTest.js
	},
};

const urlDatabase = {
	b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'user@example.com' },
	i3BoGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
	pqWc5L: { longURL: 'https://www.bloomberg.com/canada', userID: 'user2@example.com' },
	SHbJto: { longURL: 'https://ca.finance.yahoo.com/', userID: 'user2@example.com' },
	i3BsGr: { longURL: 'https://www.bloomberg.ca', userID: 'user@example.com' },
};

module.exports = { users, urlDatabase };
