const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes.js/auth.routes'); // Import the authRouter from the auth.routes.js file

const app = express();

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies

app.use('/api/auth', authRouter); // Use the authRouter for routes starting with /api/auth

module.exports = app;