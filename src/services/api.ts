import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'donor' | 'recipient' | 'volunteer';
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationItem {
  id: string;
  title: string;
  description: string;
  donorName: string;
  donorId: string;
  location: string;
  expiry: string;
  quantity: string;
  status: 'available' | 'reserved' | 'completed';
  imageUrl: string;
  foodType: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDonationData {
  title: string;
  description: string;
  donorName: string;
  donorId: string;
  location: string;
  expiry: Date | string;
  quantity: string;
  imageUrl: string;
  foodType: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'donor' | 'recipient' | 'volunteer';
}

export const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const apiMethods = {
  // Auth endpoints
  async login(data: LoginData): Promise<{ message: string; user: User }> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  async signup(data: SignupData): Promise<{ message: string; user: User }> {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await api.get('/api/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<{ message: string; user: User }> {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // Donation endpoints
  async getDonations(filters?: { status?: string; donorId?: string }): Promise<DonationItem[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.donorId) params.append('donorId', filters.donorId);
    
    const response = await api.get(`/api/donations?${params.toString()}`);
    return response.data;
  },

  async getDonationById(id: string): Promise<DonationItem> {
    const response = await api.get(`/api/donations/${id}`);
    return response.data;
  },

  async createDonation(donationData: CreateDonationData): Promise<{ message: string; donation: DonationItem }> {
    try {
      // Check if we have a base64 image
      if (donationData.imageUrl && donationData.imageUrl.startsWith('data:image')) {
        console.log('Processing base64 image before sending to server...');
        // The image is already optimized in the DonationForm component
      }
      
      const response = await api.post('/api/donations', donationData);
      return response.data;
    } catch (error) {
      console.error('Error creating donation:', error);
      if (error.response?.status === 413) {
        // Payload too large error
        throw new Error('Image too large. Please use a smaller image or choose from the presets.');
      }
      throw error;
    }
  },

  async updateDonation(id: string, donationData: Partial<DonationItem>): Promise<{ message: string; donation: DonationItem }> {
    const response = await api.put(`/api/donations/${id}`, donationData);
    return response.data;
  },

  async updateDonationStatus(id: string, status: 'available' | 'reserved' | 'completed'): Promise<{ message: string; donation: DonationItem }> {
    const response = await api.patch(`/api/donations/${id}/status`, { status });
    return response.data;
  },

  async deleteDonation(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/api/donations/${id}`);
    return response.data;
  },

  async getData() {
    const response = await api.get('/');
    return response.data;
  },
};