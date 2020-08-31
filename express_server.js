const express = require('express');
const ejs = require('ejs');
const app = express();

const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
	b2xVn2: 'http://www.lighthouselabs.ca',
	'9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
	res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
	res.send(urlDatabase);
});

app.get('/urls', (req, res) => {
	let templateVars = { urls: urlDatabase };

	res.render('urls_index', templateVars);
});

app.get('/hello', (req, res) => {
	res.send('<html><body>Hello <b>World</body></html>\n');
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
