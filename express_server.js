const express = require('express');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const ERROR_MESSAGE = require('./constants');
const { users, urlDatabase } = require('./sampleDatabase');

const {
	generateNewID,
	generateRandomString,
	doesEmailExist,
	validateUserCredentials,
	getUserURLs,
} = require('./helpers');

const app = express();
const PORT = 8080;

//======== MIDDLEWARE =======================

app.use(express.urlencoded({ extended: false }));
app.use(express.static('img'));
app.use(methodOverride('_method'));
app.use(
	cookieSession({
		name: 'session',
		keys: ['secretkey'],
	})
);
//============================================
app.set('view engine', 'ejs');

//============================================
app.get('/', (req, res) => {
	res.redirect('/urls');
});

app.get('/urls', (req, res) => {
	const user_id = req.session.user_id;
	const userURLDatabase = getUserURLs(user_id);

	const templateVars = { urls: userURLDatabase, user_id: req.session.user_id };
	res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
	let templateVars = { user_id: req.session.user_id };
	if (!req.session.user_id) {
		res.redirect('/login');
	} else {
		res.render('urls_new', templateVars);
	}
});

app.get('/register', (req, res) => {
	const templateVars = {
		user_id: req.session.user_id,
		error: false,
	};
	res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
	const templateVars = { user_id: req.session.user_id, error: false };

	res.render('urls_login', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
	const user_id = req.session.user_id;
	if (user_id) {
		let templateVars = {
			shortURL: req.params.shortURL,
			longURL: urlDatabase[req.params.shortURL].longURL,
			user_id: req.session.user_id,
		};
		res.render('urls_show', templateVars);
	} else {
		res.redirect('/urls');
	}
});

app.get('/u/:shortURL', (req, res) => {
	const user_id = req.session.user_id;
	if (user_id) {
		const longURL = urlDatabase[req.params.shortURL].longURL;
		res.redirect(longURL);
	} else {
		res.redirect('/urls');
	}
});

//==============================================================================================

app.post('/register', (req, res) => {
	const id = generateNewID();
	let { email, password } = req.body;

	// what happens if you try to register without an email or a password?
	if (!email || !password) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.no_email_and_password,
			error: true,
		};

		res.status(400);
		return res.render('urls_register', templateVars);
	}

	// check if email already exist - error msg
	else if (doesEmailExist(email)) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.issue_with_email_password,
			error: true,
		};
		res.status(400);
		return res.render('urls_register', templateVars);
	} else {
		password = bcrypt.hashSync(password, 10);
		users[id] = { id, email, password };
		req.session.user_id = email;
		res.redirect('/urls');
	}
});

app.post('/login', (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.no_email_and_password,
			error: true,
		};

		res.status(403);
		return res.render('urls_login', templateVars);
	} else if (!doesEmailExist(email)) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.account_does_not_exist,
			error: true,
		};
		res.status(403);
		return res.render('urls_login', templateVars);
	} else if (doesEmailExist(email) && !validateUserCredentials(email, password)) {
		const templateVars = {
			user_id: '',
			message: ERROR_MESSAGE.issue_with_email_password,
			error: true,
		};

		res.status(403);
		return res.render('urls_login', templateVars);
	} else {
		const user_id = email;
		const userURLDatabase = getUserURLs(user_id);

		let templateVars = { urls: userURLDatabase, user_id: user_id };
		req.session.user_id = user_id;
		res.render('urls_index', templateVars);
	}
});

app.post('/urls/logout', (req, res) => {
	req.session = null;
	res.redirect('/urls');
});

app.post('/urls', (req, res) => {
	const user_id = req.session.user_id;
	if (user_id) {
		const shortURL = generateRandomString();
		urlDatabase[shortURL] = {
			longURL: req.body.longURL,
			userID: req.session.user_id,
		};
	}
	res.redirect('/urls');
});

app.delete('/urls/:shortURL/delete', (req, res) => {
	const user_id = req.session.user_id;
	if (user_id) {
		const shortURL = req.params.shortURL;
		delete urlDatabase[shortURL];
		console.log('entry was deleted');
	}
	res.redirect('/urls');
});

app.put('/urls/:shortURL', (req, res) => {
	const user_id = req.session.user_id;
	if (user_id) {
		const longURL = req.body.newLongURLinputText;
		urlDatabase[req.params.shortURL].longURL = longURL;
		console.log('entry was updated');
	}
	res.redirect('/urls');
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`);
});
