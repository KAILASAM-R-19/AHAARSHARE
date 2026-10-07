const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo'], required: true },
  organizationName: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
