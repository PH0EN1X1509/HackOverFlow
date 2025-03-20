
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SignIn = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Quick form validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  // For demo purposes, we'll add quick login buttons
  const handleQuickLogin = (role: 'donor' | 'recipient' | 'volunteer') => {
    let demoCredentials = {
      donor: { email: 'donor@example.com', password: 'password' },
      recipient: { email: 'recipient@example.com', password: 'password' },
      volunteer: { email: 'volunteer@example.com', password: 'password' },
    };
    
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    
    // Auto-login after setting credentials
    login(demoCredentials[role].email, demoCredentials[role].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-border/50 overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Back</span>
              </Link>
              <h1 className="text-xl font-semibold">Sign In</h1>
            </div>
            <Link 
              to="/"
              className="flex items-center space-x-1.5"
            >
              <div className="w-6 h-6 rounded-full bg-foodshare-500 flex items-center justify-center">
                <span className="text-white font-semibold text-xs">FS</span>
              </div>
            </Link>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="focus-visible:ring-foodshare-500"
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-foodshare-600 hover:text-foodshare-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="focus-visible:ring-foodshare-500"
                  autoComplete="current-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-foodshare-600 hover:text-foodshare-700 transition-colors font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                    Quick Demo Login
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickLogin('donor')}
                  className="text-xs"
                >
                  Donor Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickLogin('recipient')}
                  className="text-xs"
                >
                  Recipient Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickLogin('volunteer')}
                  className="text-xs"
                >
                  Volunteer Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
