const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const alphanumeric = require('alphanumeric-id');
const uuid = require('uuid').v4;

// const ejs = require('ejs');
const app = express();
const PORT = 8080;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');

const users = {
	userRandomID: {
		id: 'userRandomID',
		email: 'user@example.com',
		password: 'purple-monkey-dinosaur',
	},
	user2RandomID: {
		id: 'user2RandomID',
		email: 'user2@example.com',
		password: 'dishwasher-funk',
	},
};

const ERROR_MESSAGE = {
	no_email_and_password: 'Please enter an email or password',
	issue_with_email_password: 'There is an issue with the email or password',
	account_does_not_exist: 'Account does not exist. Please register a new account',
};

const urlDatabase = {
	b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'user@example.com' },
	i3BoGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
	pqWc5L: { longURL: 'https://www.bloomberg.com/canada', userID: 'user2@example.com' },
	SHbJto: { longURL: 'https://ca.finance.yahoo.com/', userID: 'user2@example.com' },
	i3BodsGr: { longURL: 'https://www.google.ca', userID: 'user@example.com' },
};

const generateNewID = () => {
	return uuid().split('-')[1];
};

const generateRandomString = () => {
	return alphanumeric(6);
};

const doesNewEmailExist = (newEmail) => {
	const emailDB = Object.keys(users).map((id) => users[id].email);
	return emailDB.includes(newEmail);
};

const validatePassword = (userEmail, userPassword) => {
	for (const id in users) {
		if (users[id].email === userEmail && users[id].password === userPassword) {
			return true;
		}
	}
	return false;
};

const getUserURLDatabase = (email) => {
	const userURLObj = {};
	for (const url in urlDatabase) {
		if (urlDatabase[url].userID === email) {
			userURLObj[url] = urlDatabase[url];
		}
	}
	return userURLObj;
};

app.get('/urls', (req, res) => {
	const user_id = req.cookies.user_id;
	const userURLDatabase = getUserURLDatabase(user_id);

	let templateVars = { urls: userURLDatabase, user_id: req.cookies.user_id };
	res.render('urls_index', templateVars); // second argument takes on object
});

app.get('/urls/new', (req, res) => {
	let templateVars = { user_id: req.cookies.user_id };
	if (!req.cookies.user_id) {
		res.redirect('/login');
	} else {
		res.render('urls_new', templateVars);
	}
});

app.get('/register', (req, res) => {
	const templateVars = {
		user_id: req.cookies.user_id,
		error: false,
	};
	res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
	const id = generateNewID(); // change to uuid --> require uuid.v4
	const { email, password } = req.body;

	// what happens if you try to register without an email or a password?
	if (!email || !password) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.no_email_and_password,
			error: true,
		};
		// res.cookie('error', true);
		// res.cookie('message', ERROR_MESSAGE.no_email_and_password);
		// res.cookie('user_id', ''); //check with mentor?
		res.status(400);
		return res.render('urls_register', templateVars);
	}

	// check if email already exist -error msg enter new email
	else if (doesNewEmailExist(email)) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.issue_with_email_password,
			error: true,
		};
		// res.cookie('error', true);
		// res.cookie('message', ERROR_MESSAGE.no_email_and_password);
		// res.cookie('user_id', '');
		res.status(400);
		return res.render('urls_register', templateVars); // render or redirect???
	} else {
		users[id] = { id, email, password };
		console.log(users);
		res.cookie('user_id', email);
		res.redirect('/urls');
	}
});

app.get('/login', (req, res) => {
	const templateVars = { user_id: req.cookies.user_id, error: false };
	res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
	// res.cookie('username', req.body.username);
	const { email, password } = req.body;

	if (!email || !password) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.no_email_and_password,
			error: true,
		};
		// res.cookie('error', true);
		// res.cookie('message', ERROR_MESSAGE.no_email_and_password);
		// res.cookie('user_id', '');
		res.status(403);
		return res.render('urls_login', templateVars);
	} else if (!doesNewEmailExist(email)) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.account_does_not_exist,
			error: true,
		};
		res.status(403);
		return res.render('urls_login', templateVars);
	} else if (doesNewEmailExist(email) && !validatePassword(email, password)) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.issue_with_email_password,
			error: true,
		};

		// res.cookie('error', true);
		// res.cookie('message', ERROR_MESSAGE.issue_with_email_password);
		// res.cookie('user_id', '');
		res.status(403);
		return res.render('urls_login', templateVars);
	} else {
		const user_id = email;
		const userURLDatabase = getUserURLDatabase(user_id);

		let templateVars = { urls: userURLDatabase, user_id: user_id };
		res.cookie('user_id', email);
		res.render('urls_index', templateVars);
	}
});

app.post('/urls/logout', (req, res) => {
	// another way to clear cookie
	// res.clearCookie('user_id');
	res.cookie('user_id', '');

	res.redirect('/urls');
});

app.get('/urls/:shortURL', (req, res) => {
	const user_id = req.cookies.user_id;
	if (user_id) {
		let templateVars = {
			shortURL: req.params.shortURL,
			longURL: urlDatabase[req.params.shortURL].longURL,
			user_id: req.cookies.user_id,
		};
		res.render('urls_show', templateVars);
	} else {
		res.redirect('/urls');
	}
});

app.post('/urls', (req, res) => {
	const shortURL = generateRandomString();

	urlDatabase[shortURL] = {
		longURL: req.body.longURL,
		userID: req.cookies.user_id,
	};
	res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
	const user_id = req.cookies.user_id;
	if (user_id) {
		const shortURL = req.params.shortURL;
		delete urlDatabase[shortURL];
		console.log('entry was deleted');
		res.redirect('/urls');
	}
	res.redirect('login');
});

app.post('/urls/:shortURL', (req, res) => {
	// get the input from text input
	const user_id = req.cookies.user_id;
	if (user_id) {
		const longURL = req.body.newLongURLinputText;
		urlDatabase[req.params.shortURL].longURL = longURL;
		console.log('urlDatabase:', urlDatabase);
		console.log('entry was updated');
		res.redirect('/urls');
	} else {
		res.redirect('/urls');
	}
});

app.get('/u/:shortURL', (req, res) => {
	const longURL = urlDatabase[req.params.shortURL].longURL;
	res.redirect(longURL);
});
// app.get('/set', (req, res) => {
// 	const a = 1;
// 	res.send(`a = ${a}`);
// });
/* 
a is not accessible in the other function/cb. The user will NOT see 'a' set to 1 in '/fetch/
In fact, 'a' is not defined in this scope, and will result in a reference error when anyone visits that URL
*/
// app.get('/fetch', (req, res) => {
// 	res.send(`a = ${a}`);
// });

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`);
});
