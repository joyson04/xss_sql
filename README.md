
<img width="1920" height="992" alt="22" src="https://github.com/user-attachments/assets/e51da25b-5444-4b8f-9779-ade3cf6a9e6b" />


# Node.js + MySQL Security Demo

This small demo shows examples of SQL Injection and Cross-Site Scripting (XSS) vulnerabilities and how to fix them. It intentionally includes both vulnerable and fixed routes for learning.

Files added:
- `app.js` - main Express app with vulnerable and fixed routes
- `db.js` - mysql2 pool helper
- `views/` - EJS templates (index, users, comments)
- `public/` - placeholder assets (replace with real Bootstrap if desired)
- `schema.sql` - schema and sample data
- `.env.example` - environment variables

Setup
1. Copy `.env.example` to `.env` and set your MySQL credentials.
2. Create the database and tables: run `schema.sql` in your MySQL server (for example using MySQL Workbench or the `mysql` CLI).
3. Install dependencies and start the server:

```powershell
cd "c:\Users\aravi\Desktop\New folder (2)"
npm install
npm start
```

Usage
- Visit `http://localhost:3000`.
- SQL injection demo:
  - Use the "Vulnerable" search and try input: `' OR '1'='1` to see it return many rows or manipulate the query.
  - Use the "Fixed" search to see parameterized queries prevent injection.
- XSS demo:
  - Post a comment containing `<script>alert(1)</script>` and view comments in "Vulnerable" mode to see the script executed.
  - View comments in "Fixed" mode to see the output escaped.

Security notes
- NEVER deploy code with the vulnerable endpoints to production.
- SQL injection is prevented by using parameterized queries / prepared statements.
- XSS is prevented by escaping user-controlled output. EJS escapes by default with `<%= %>`; use `<%- %>` to render raw HTML (dangerous).
- Also follow other best practices: use least privilege DB user, sanitize inputs, use CSP and security headers (helmet helps), and keep dependencies up to date.

If you want, I can run `npm install` and start the server for you in the terminal — tell me to proceed.


Vulnerable Demo App (Node.js + MySQL)

This small app intentionally contains SQL injection and XSS vulnerabilities for learning and local testing only. Do NOT deploy to production.

Quick start (Windows PowerShell):

1. Create the MySQL database and table:

   # Import schema into your MySQL server
   mysql -u root -p < db.sql

2. Install dependencies and start server:

   npm install
   npm start

3. Open http://localhost:3000

Vulnerabilities and remediation notes:

- SQL Injection: `app.js` uses string concatenation to build SQL queries. Use parameterized queries / prepared statements (e.g., use `db.execute` with `?` placeholders) or an ORM.

- XSS: `profile.ejs` renders `bio` without escaping. Escape output or sanitize input. Use templating auto-escaping and Content Security Policy (CSP).

Use this project for local testing only.

<img width="1920" height="1032" alt="Screenshot 2025-10-17 204749" src="https://github.com/user-attachments/assets/8339563d-6004-4b88-a9d7-7fa8008c1f91" />





