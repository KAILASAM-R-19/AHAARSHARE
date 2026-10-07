const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, required: true },
  quantity: { type: Number, required: true },
  preparationTime: { type: Date, required: true },
  location: { type: String, required: true },
  contactPhone: { type: String, required: true },
  status: { type: String, enum: ['available', 'claimed'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
