const express = require('express');
require('./db/conn');
const app = express();
var userRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

module.exports = app;