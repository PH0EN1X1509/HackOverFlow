import express from 'express';
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  updateDonationStatus,
  deleteDonation
} from '../controllers/donationController.js';

const router = express.Router();

// Donation routes
router.get('/', getDonations);
router.get('/:id', getDonationById);
router.post('/', createDonation);
router.put('/:id', updateDonation);
router.patch('/:id/status', updateDonationStatus);
router.delete('/:id', deleteDonation);

export default router;