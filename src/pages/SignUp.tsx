import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SignUp = () => {
  const { signup, currentUser, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'recipient' | 'volunteer' | ''>('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!name || !username || !email || !password || !role) {
      setError('Please fill in all fields and select a role.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await signup({
        name,
        username,
        email,
        password,
        role: role as 'donor' | 'recipient' | 'volunteer'
      });
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    }
  };

  const goToNextStep = () => {
    if (step === 1 && (!name || !username || !email || !password)) {
      setError('Please fill in all fields to continue.');
      return;
    }
    
    setError('');
    setStep(2);
  };

  const goToPreviousStep = () => {
    setStep(1);
  };

  const roleOptions = [
    {
      id: 'donor',
      title: 'Donor',
      description: 'I want to donate surplus food',
      icon: '🍲',
    },
    {
      id: 'recipient',
      title: 'Recipient',
      description: 'I represent an organization that needs food',
      icon: '🏢',
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'I want to help with food transportation',
      icon: '🚚',
    },
  ];

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
              <h1 className="text-xl font-semibold">Create Account</h1>
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
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-foodshare-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > 1 ? <Check className="h-3 w-3" /> : "1"}
                  </div>
                  <div className={`h-1 w-12 ${step > 1 ? 'bg-foodshare-500' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-foodshare-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Account Details</span>
                <span>Select Role</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="focus-visible:ring-foodshare-500"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      className="focus-visible:ring-foodshare-500"
                      autoComplete="username"
                    />
                  </div>
                  
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="focus-visible:ring-foodshare-500"
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters long
                    </p>
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white"
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">I want to join as:</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the role that best describes how you'll use FoodShare
                    </p>
                    
                    <RadioGroup 
                      value={role} 
                      onValueChange={(value) => setRole(value as 'donor' | 'recipient' | 'volunteer')}
                      className="space-y-3"
                    >
                      {roleOptions.map((option) => (
                        <div 
                          key={option.id}
                          className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                            role === option.id 
                              ? 'border-foodshare-500 bg-foodshare-50 dark:bg-foodshare-900/20' 
                              : 'border-border hover:border-foodshare-200'
                          }`}
                        >
                          <RadioGroupItem 
                            value={option.id} 
                            id={option.id} 
                            className="sr-only" 
                          />
                          <div className="flex items-start">
                            <span className="text-xl mr-3">{option.icon}</span>
                            <div>
                              <Label 
                                htmlFor={option.id}
                                className="text-base font-medium cursor-pointer"
                              >
                                {option.title}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPreviousStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-foodshare-500 hover:bg-foodshare-600 text-white"
                      disabled={isLoading || !role}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link 
                      to="/signin" 
                      className="text-foodshare-600 hover:text-foodshare-700 transition-colors font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
