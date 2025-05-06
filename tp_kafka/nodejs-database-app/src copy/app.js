const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exampleRoutes = require('./routes/exampleRoutes');
const { connectToDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectToDatabase();

// Routes
app.use('/api/examples', exampleRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});