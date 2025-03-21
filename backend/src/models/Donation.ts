import mongoose, { Document } from 'mongoose';

export interface IDonation extends Document {
  title: string;
  description: string;
  donorName: string;
  donorId: string;
  location: string;
  expiry: Date;
  quantity: string;
  status: 'available' | 'reserved' | 'completed';
  imageUrl: string;
  foodType: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  donorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  expiry: {
    type: Date,
    required: true
  },
  quantity: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'reserved', 'completed'],
    default: 'available'
  },
  imageUrl: {
    type: String,
    required: true,
    maxlength: [7000000, "Image URL is too large, please use a smaller image"]
  },
  foodType: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export const Donation = mongoose.model<IDonation>('Donation', donationSchema);