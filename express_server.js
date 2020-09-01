const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const alphanumeric = require('alphanumeric-id');

// const ejs = require('ejs');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = 8080;

const generateRandomString = () => {
	return alphanumeric(6);
};

app.set('view engine', 'ejs');

const urlDatabase = {
	b2xVn2: 'http://www.lighthouselabs.ca',
	'9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
	console.log(`Cookies: ${req.cookies}`);
});

app.get('/urls.json', (req, res) => {
	res.send(urlDatabase);
});

app.get('/urls', (req, res) => {
	console.log('req.cookies :', req.cookies);
	let templateVars = { urls: urlDatabase, username: req.cookies.username };

	//res.render('fileName in views folder', {object})
	res.render('urls_index', templateVars); // second argument takes on object
});

app.get('/hello', (req, res) => {
	let templateVars = { greeting: 'Hello World!' };
	res.render('hello_world', templateVars);
});

app.get('/urls/new', (req, res) => {
	res.render('urls_new');
});

app.post('/urls/login', (req, res) => {
	res.cookie('username', req.body.username);
	console.log(`res.cookies: ${res.cookie}`);

	res.redirect('/urls');
});

// app.post('/login', (req, res) => {
// 	let templateVars = { urls: urlDatabase /*username: req.cookies['username']*/ };

// 	res.render('urls_index', templateVars);
// });

app.get('/urls/:shortURL', (req, res) => {
	let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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
