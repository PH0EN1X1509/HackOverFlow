import { Truck } from 'lucide-react';
import DonationCard, { DonationItem } from '@/components/DonationCard';

interface DeliveriesViewProps {
  getFilteredDonations: (status?: DonationItem['status']) => DonationItem[];
  handleStatusChange: (id: string, newStatus: DonationItem['status']) => void;
  handleDeleteDonation: (id: string) => Promise<void>;
}

const DeliveriesView = ({ 
  getFilteredDonations, 
  handleStatusChange,
  handleDeleteDonation
}: DeliveriesViewProps) => {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pending Deliveries</h1>
        <p className="text-muted-foreground">
          Available deliveries that need your help
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredDonations('reserved').map((donation) => (
          <DonationCard 
            key={donation.id} 
            donation={donation} 
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteDonation}
          />
        ))}
        
        {getFilteredDonations('reserved').length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Pending Deliveries</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              There are no deliveries that need your help at this time.
              Check back later for new delivery opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveriesView;
