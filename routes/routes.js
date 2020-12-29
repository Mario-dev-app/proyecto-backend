const express = require('express');
const app = express();

app.use(require('./libro'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./cliente'));

module.exports = app;