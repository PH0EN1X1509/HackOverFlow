import { Request, Response } from 'express';
import { Donation } from '../models/Donation.js';

// Get all donations with optional filtering
export const getDonations = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
    const { status, donorId } = req.query;
    
    // Build filter object based on query params
    const filter: any = {};
    if (status) filter.status = status;
    if (donorId) filter.donorId = donorId;
    
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error });
  }
};

// Get donation by ID
export const getDonationById = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation', error });
  }
};

// Create new donation
export const createDonation = async (req: Request, res: Response) => {
  try {
    const donationData = req.body;
    
    // Validate required fields
    if (!donationData.title || !donationData.donorId || !donationData.expiry) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    
    // Create new donation
    const donation = new Donation(donationData);
    const savedDonation = await donation.save();
    
    res.status(201).json({ 
      message: 'Donation created successfully', 
      donation: savedDonation 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating donation', error });
  }
};

// Update donation
export const updateDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );
    
    if (!updatedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json({ 
      message: 'Donation updated successfully', 
      donation: updatedDonation 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating donation', error });
  }
};

// Update donation status
export const updateDonationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['available', 'reserved', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json({ 
      message: 'Donation status updated successfully', 
      donation: updatedDonation 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating donation status', error });
  }
};

// Delete donation
export const deleteDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedDonation = await Donation.findByIdAndDelete(id);
    
    if (!deletedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donation', error });
  }
};