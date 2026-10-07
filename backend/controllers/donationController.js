const Donation = require('../models/Donation');

function createDonation(req, res) {
  const donation = new Donation({
    donor: req.body.donor,
    foodType: req.body.foodType,
    quantity: req.body.quantity,
    preparationTime: req.body.preparationTime,
    location: req.body.location,
    contactPhone: req.body.contactPhone
  });

  donation.save()
    .then(function(savedDonation) {
      res.status(201).json(savedDonation);
    })
    .catch(function(error) {
      res.status(500).json({ error: 'Failed to create donation' });
    });
}

function getDonationsByDonor(req, res) {
  Donation.find({ donor: req.params.donorId }).sort({ createdAt: -1 })
    .then(function(donations) {
      res.json(donations);
    })
    .catch(function(error) {
      res.status(500).json({ error: 'Failed to fetch donations' });
    });
}

function getNearbyDonations(req, res) {
  const searchLocation = req.query.location || '';
  
  const query = { status: 'available' };
  if (searchLocation) {
    query.location = { $regex: searchLocation, $options: 'i' };
  }

  Donation.find(query).populate('donor', 'organizationName phoneNumber')
    .then(function(donations) {
      res.json(donations);
    })
    .catch(function(error) {
      res.status(500).json({ error: 'Failed to fetch nearby donations' });
    });
}

function claimDonation(req, res) {
  Donation.findOneAndUpdate(
    { _id: req.params.id, status: 'available' },
    { status: 'claimed', claimedBy: req.body.ngoId },
    { new: true }
  )
    .then(function(donation) {
      if (!donation) {
        return res.status(404).json({ error: 'Donation not available' });
      }
      res.json(donation);
    })
    .catch(function(error) {
      res.status(500).json({ error: 'Failed to claim donation' });
    });
}

module.exports = {
  createDonation: createDonation,
  getDonationsByDonor: getDonationsByDonor,
  getNearbyDonations: getNearbyDonations,
  claimDonation: claimDonation
};
