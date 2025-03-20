
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export type UserRole = 'donor' | 'recipient' | 'volunteer' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Restaurant Owner',
    email: 'donor@example.com',
    role: 'donor',
    avatar: '/donor-avatar.png',
  },
  {
    id: '2',
    name: 'Shelter Manager',
    email: 'recipient@example.com',
    role: 'recipient',
    avatar: '/recipient-avatar.png',
  },
  {
    id: '3',
    name: 'Community Volunteer',
    email: 'volunteer@example.com',
    role: 'volunteer',
    avatar: '/volunteer-avatar.png',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user on first load
    const storedUser = localStorage.getItem('foodshare_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Find user by email (mock authentication)
      const user = MOCK_USERS.find(user => user.email === email);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('foodshare_user', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/dashboard');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create new user (mock signup)
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role,
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('foodshare_user', JSON.stringify(newUser));
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('foodshare_user');
    toast.info("You've been logged out");
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
