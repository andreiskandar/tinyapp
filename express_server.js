const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const alphanumeric = require('alphanumeric-id');

// const ejs = require('ejs');
const app = express();
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = 8080;

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

const generateNewID = () => {
	return alphanumeric(2);
};

const generateRandomString = () => {
	return alphanumeric(6);
};

app.set('view engine', 'ejs');

const urlDatabase = {
	b2xVn2: 'http://www.lighthouselabs.ca',
	'9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {});

app.get('/urls', (req, res) => {
	console.log('req.cookies :', req.cookies);
	let templateVars = { urls: urlDatabase, user_id: req.cookies.user_id };

	//res.render('fileName in views folder', {object})
	res.render('urls_index', templateVars); // second argument takes on object
});

app.get('/urls/new', (req, res) => {
	let templateVars = { user_id: req.cookies.user_id };
	res.render('urls_new', templateVars);
});

app.get('/register', (req, res) => {
	const templateVars = { user_id: req.cookies.user_id };
	res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
	let id = generateNewID();
	if (users.hasOwnProperty(id)) id = generateNewID();
	const { email, password } = req.body;
	const templateVars = {
		statusCode: 400,
		user_id: req.cookies.email,
	};
	console.log('templateVars:', templateVars);
	// what happens if you try to register without an email or a password?
	if (!email || !password) {
		templateVars[message] = 'Bad Request, Please enter email or password';

		res.status(400);
		res.render('urls_error', templateVars);
	}
	// check if email already exist - enter new email
	for (const id in users) {
		console.log(id);
		if (email === users[id].email) {
			templateVars[message] = 'Bad Request. Email already exists. Please enter new email address';
			console.log(templateVars);
			res.status(400);
			// res.send('Bad Request');
			res.render('urls_error', templateVars);
			res.redirect('/register');
		}
	}
	users[id] = { id, email, password };
	console.log(JSON.stringify(users));
	res.cookie('user_id', email);
	console.log('templateVars:', templateVars);

	res.redirect('/urls');
});

app.get('/login', (req, res) => {
	const templateVars = { user_id: req.cookies.user_id };
	res.render('urls_login', templateVars);
});

app.post('/urls/login', (req, res) => {
	// res.cookie('username', req.body.username);

	res.redirect('/urls');
});

app.post('/urls/logout', (req, res) => {
	// another way to clear cookie
	// res.clearCookie('user_id');
	res.cookie('user_id', '');

	res.redirect('/urls');
});

app.get('/urls/:shortURL', (req, res) => {
	let templateVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
		username: req.cookies.user_id,
	};
	res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
	const shortURL = generateRandomString();
	urlDatabase[shortURL] = req.body.longURL;
	console.log(urlDatabase);
	// res.send('Ok');
	res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
	console.log('entry was deleted');
	const shortURL = req.params.shortURL;

	delete urlDatabase[shortURL];
	res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
	// get the input from text input
	const longURL = req.body.newLongURLinputText;
	urlDatabase[req.params.shortURL] = req.body.newLongURLinputText;
	console.log('urlDatabase:', urlDatabase);
	console.log('entry was updated');
	res.redirect('/urls');
});

app.get('/u/:shortURL', (req, res) => {
	const longURL = urlDatabase[req.params.shortURL];
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
