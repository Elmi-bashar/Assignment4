// app.js
const express = require('express');
const app = express();

app.use(express.json()); // parse JSON

// Import routes
const homeRoute = require('./api/home');
const dataRoute = require('./api/data');
const indexRoute = require('./api/index');

// Use routes
app.use('/', homeRoute);
app.use('/data', dataRoute);
app.use('/index', indexRoute);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
