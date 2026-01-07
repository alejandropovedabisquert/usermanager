const express = require('express');
var cors = require('cors')
require('./db/conn');
const app = express();
var userRouter = require('./routes/users');
var refreshToken = require('./routes/refreshToken');

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/users', userRouter);
app.use('/refresh', refreshToken);

module.exports = app;