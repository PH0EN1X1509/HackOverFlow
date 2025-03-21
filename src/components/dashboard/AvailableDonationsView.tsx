import { Utensils, Filter } from 'lucide-react';
import DonationCard, { DonationItem } from '@/components/DonationCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface AvailableDonationsViewProps {
  getFilteredDonations: (status?: DonationItem['status']) => DonationItem[];
  handleStatusChange: (id: string, newStatus: DonationItem['status']) => void;
  handleDeleteDonation: (id: string) => Promise<void>;
}

const AvailableDonationsView = ({ 
  getFilteredDonations, 
  handleStatusChange,
  handleDeleteDonation 
}: AvailableDonationsViewProps) => {
  const [foodTypeFilter, setFoodTypeFilter] = useState<string | null>(null);
  const availableDonations = getFilteredDonations('available');
  
  // Get unique food types for filtering
  const foodTypes = [...new Set(availableDonations.map(d => d.foodType))];
  
  // Apply food type filter if set
  const filteredDonations = foodTypeFilter
    ? availableDonations.filter(d => d.foodType === foodTypeFilter)
    : availableDonations;
  
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Available Donations</h1>
            <p className="text-muted-foreground">
              Browse and reserve available food in your area
            </p>
          </div>
          
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm">
            {availableDonations.length} Available {availableDonations.length === 1 ? 'Item' : 'Items'}
          </Badge>
        </div>
        
        {foodTypes.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              className={!foodTypeFilter ? 'bg-secondary' : ''}
              onClick={() => setFoodTypeFilter(null)}
            >
              All
            </Button>
            
            {foodTypes.map(type => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                className={foodTypeFilter === type ? 'bg-secondary' : ''}
                onClick={() => setFoodTypeFilter(type)}
              >
                {type}
              </Button>
            ))}
            
            <div className="ml-auto flex items-center text-sm text-muted-foreground">
              <Filter className="h-3 w-3 mr-1" />
              Filter by type
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map((donation) => (
          <DonationCard 
            key={donation.id} 
            donation={donation} 
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteDonation}
          />
        ))}
        
        {filteredDonations.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Utensils className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Available Donations</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              {foodTypeFilter 
                ? `There are no available ${foodTypeFilter} donations at this time.` 
                : "There are no available donations in your area at this time."}
              {foodTypeFilter && (
                <Button variant="link" className="pl-1 h-auto p-0" onClick={() => setFoodTypeFilter(null)}>
                  Clear filter
                </Button>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableDonationsView;
