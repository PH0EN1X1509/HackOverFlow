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
    
    // Handle the image URL
    if (donationData.imageUrl && donationData.imageUrl.startsWith('data:image')) {
      try {
        console.log("Processing base64 image upload...");
        
        // Validate the base64 string format
        const base64Regex = /^data:image\/(jpeg|jpg|png|gif);base64,/;
        if (!base64Regex.test(donationData.imageUrl)) {
          console.warn("Invalid base64 image format");
          // Use a default image instead
          donationData.imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
        }
        
        // Check approximate size (0.75 * length is rough estimate of decoded size in bytes)
        const base64Data = donationData.imageUrl.split(',')[1] || '';
        const approximateSize = base64Data.length * 0.75;
        
        // If image is too large (>5MB), use default instead
        if (approximateSize > 5 * 1024 * 1024) {
          console.warn("Image too large:", Math.round(approximateSize / 1024 / 1024), "MB");
          return res.status(413).json({ 
            message: 'Image too large. Please use a smaller image or choose from the presets.' 
          });
        }
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        // If there's an error processing the image, use a default one
        donationData.imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
      }
    } else if (!donationData.imageUrl) {
      // If no image is provided, use a default one
      donationData.imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    }
    
    // Create new donation
    const donation = new Donation(donationData);
    
    try {
      const savedDonation = await donation.save();
      res.status(201).json({ 
        message: 'Donation created successfully', 
        donation: savedDonation 
      });
    } catch (saveError: any) {
      // Check for MongoDB-specific errors
      if (saveError.name === 'ValidationError') {
        if (saveError.errors?.imageUrl) {
          return res.status(413).json({ 
            message: 'Image too large. Please use a smaller image.' 
          });
        }
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: Object.values(saveError.errors).map((err: any) => err.message) 
        });
      }
      
      throw saveError; // Re-throw for the outer catch block
    }
  } catch (error: any) {
    console.error("Donation creation error:", error);
    res.status(500).json({ 
      message: 'Error creating donation', 
      error: error.message || 'Unknown error' 
    });
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