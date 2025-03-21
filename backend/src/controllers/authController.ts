import { Request, Response } from 'express';
import { User } from '../models/User.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    if (user.password !== password) { // Note: In production, use proper password hashing
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message || 'Unknown error occurred' 
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name, role } = req.body;

    // Validate input
    if (!username || !email || !password || !name || !role) {
      return res.status(400).json({ 
        message: 'All fields are required (username, email, password, name, role)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // Note: In production, hash the password
      name,
      role,
      avatar: `/avatars/${role}-default.png` // Default avatar based on role
    });

    await user.save();

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({ 
      message: 'User created successfully', 
      user: userWithoutPassword 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message || 'Unknown error occurred' 
    });
  }
}; 