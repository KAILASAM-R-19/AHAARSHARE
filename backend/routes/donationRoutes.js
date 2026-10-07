const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/', donationController.createDonation);
router.get('/donor/:donorId', donationController.getDonationsByDonor);
router.get('/nearby', donationController.getNearbyDonations);
router.patch('/:id/claim', donationController.claimDonation);

module.exports = router;
