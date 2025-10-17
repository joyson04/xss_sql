require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db');


const app = express();
app.use(helmet());
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const options = {
  key: fs.readFileSync('server.key'),     // your private key
  cert: fs.readFileSync('server.cert')    // your certificate
};


app.get('/', (req, res) => {
  res.render('index');
});

// --- SQL Injection demo ---
// Vulnerable: constructs query by concatenation
app.get('/users/vuln', async (req, res) => {
  const q = req.query.q || '';
  //const sql = `SELECT id, username, email FROM users WHERE username LIKE '%${q}%'`;
  const sql = `SELECT * FROM users WHERE username = 'admin' LIKE '%"' ${q} LIMIT 100 --  '`; ;
  console.log(`${q}`)
  try {
    const [rows] = await db.query(sql);
    console.log
    res.render('users', { rows, q, vuln: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Fixed: parameterized query
app.get('/users/fixed', async (req, res) => {
  const q = req.query.q || '';
  const sql = `SELECT id, username, email FROM users WHERE username LIKE ?`;
  try {
    const [rows] = await db.query(sql, [`%${q}%`]);
    res.render('users', { rows, q, vuln: false });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- XSS demo ---
// Vulnerable: outputs raw comment text
app.post('/comments/vuln', async (req, res) => {
  const { username = 'anonymous', comment = '' } = req.body;
  const sql = `INSERT INTO comments (username, comment) VALUES (?, ?)`;
  try {
    await db.query(sql, [username, comment]);
    res.redirect('/comments?vuln=1');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Show comments (vuln or fixed rendering determined by query param)
app.get('/comments', async (req, res) => {
  const vuln = req.query.vuln === '1';
  try {
    const [rows] = await db.query('SELECT id, username, comment, created_at FROM comments ORDER BY id DESC LIMIT 50');
    res.render('comments', { rows, vuln });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const port = process.env.PORT || 3000;
const server = https.createServer(options, app);
server.listen(port, () => console.log(`App listening on https://localhost:${port}`));