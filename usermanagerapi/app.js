const express = require('express');
var cors = require('cors')
require('./db/conn');
const app = express();
var userRouter = require('./routes/users');

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/users', userRouter);

module.exports = app;