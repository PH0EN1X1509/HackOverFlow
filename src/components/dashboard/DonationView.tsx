import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DonationForm, { DonationFormValues } from '@/components/DonationForm';
import { useNavigate } from 'react-router-dom';

interface DonationViewProps {
  handleAddDonation: (formData: DonationFormValues) => void;
}

const DonationView = ({ handleAddDonation }: DonationViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: DonationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await handleAddDonation(formData);
      setSuccess(true);
      
      // Navigate back to overview after a short delay
      setTimeout(() => {
        navigate('/dashboard/overview');
      }, 2000);
    } catch (err) {
      console.error('Error submitting donation:', err);
      setError('Failed to create donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Donation</h1>
        <p className="text-muted-foreground">
          List your surplus food for donation
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-600 dark:text-green-400">Success</AlertTitle>
          <AlertDescription>Your donation has been created successfully!</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
          <CardDescription>
            Provide information about the food you're donating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonationForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationView;
