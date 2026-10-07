const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/aaharshare');

const db = mongoose.connection;

db.on('error', function(error) {
  console.log('MongoDB connection error: ' + error);
});

db.once('open', function() {
  console.log('Connected to MongoDB database');
});

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});
