
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DonationForm, { DonationFormValues } from '@/components/DonationForm';

interface DonationViewProps {
  handleAddDonation: (formData: DonationFormValues) => void;
}

const DonationView = ({ handleAddDonation }: DonationViewProps) => {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Donation</h1>
        <p className="text-muted-foreground">
          List your surplus food for donation
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
          <CardDescription>
            Provide information about the food you're donating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonationForm onSubmit={handleAddDonation} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationView;
