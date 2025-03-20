
import { Utensils } from 'lucide-react';
import DonationCard, { DonationItem } from '@/components/DonationCard';

interface AvailableDonationsViewProps {
  getFilteredDonations: (status?: DonationItem['status']) => DonationItem[];
  handleStatusChange: (id: string, newStatus: DonationItem['status']) => void;
}

const AvailableDonationsView = ({ getFilteredDonations, handleStatusChange }: AvailableDonationsViewProps) => {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Available Donations</h1>
        <p className="text-muted-foreground">
          Browse and reserve available food in your area
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredDonations('available').map((donation) => (
          <DonationCard 
            key={donation.id} 
            donation={donation} 
            onStatusChange={handleStatusChange}
          />
        ))}
        
        {getFilteredDonations('available').length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Utensils className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Available Donations</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              There are no available donations in your area at this time. 
              Check back later or expand your search area.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableDonationsView;
