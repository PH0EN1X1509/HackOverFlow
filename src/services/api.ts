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
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async signup(data: SignupData): Promise<{ message: string; user: User }> {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<{ message: string; user: User }> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getData() {
    const response = await api.get('/');
    return response.data;
  },
  
  // Add more API methods here as needed
  // Example:
  // async createData(data: any) {
  //   const response = await fetch(`${API_BASE_URL}/data`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   return response.json();
  // }
}; 