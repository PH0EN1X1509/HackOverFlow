
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonationCard, { DonationItem } from '@/components/DonationCard';

interface ReservationsViewProps {
  getFilteredDonations: (status?: DonationItem['status']) => DonationItem[];
  handleStatusChange: (id: string, newStatus: DonationItem['status']) => void;
  setActiveView: (view: string) => void;
}

const ReservationsView = ({ 
  getFilteredDonations, 
  handleStatusChange, 
  setActiveView 
}: ReservationsViewProps) => {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Reservations</h1>
        <p className="text-muted-foreground">
          Food items you've reserved
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredDonations('reserved').map((donation) => (
          <DonationCard 
            key={donation.id} 
            donation={donation} 
            onStatusChange={handleStatusChange}
          />
        ))}
        
        {getFilteredDonations('reserved').length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Active Reservations</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2 mb-6">
              You don't have any active reservations. Browse available donations to make a reservation.
            </p>
            
            <Button 
              onClick={() => setActiveView('available')}
              className="bg-foodshare-500 hover:bg-foodshare-600 text-white"
            >
              Browse Available Food
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsView;
