
import { useState } from 'react';
import { Clock, MapPin, ExternalLink, Award } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

export interface DonationItem {
  id: string;
  title: string;
  description: string;
  donorName: string;
  donorId: string;
  location: string;
  expiry: string;
  quantity: string;
  status: 'available' | 'reserved' | 'completed';
  imageUrl: string;
  foodType: string;
  createdAt: string;
}

interface DonationCardProps {
  donation: DonationItem;
  onStatusChange?: (id: string, newStatus: DonationItem['status']) => void;
}

const DonationCard = ({ donation, onStatusChange }: DonationCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { currentUser } = useAuth();
  
  const handleReserve = () => {
    if (onStatusChange) {
      onStatusChange(donation.id, 'reserved');
      toast.success("Donation reserved successfully!");
    }
  };
  
  const handleComplete = () => {
    if (onStatusChange) {
      onStatusChange(donation.id, 'completed');
      toast.success("Donation marked as completed!");
    }
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(donation.expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  const statusColor = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    reserved: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <>
      <Card className="overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-md border-border/50 hover:border-foodshare-200">
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={donation.imageUrl} 
            alt={donation.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              className={`${statusColor[donation.status]} border-none`}
            >
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
            </Badge>
          </div>
          {isExpiringSoon() && donation.status === "available" && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="border-none animate-pulse">
                Expiring Soon
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{donation.title}</CardTitle>
              <CardDescription className="line-clamp-1">{donation.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{donation.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>Expires: {new Date(donation.expiry).toLocaleDateString()}</span>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="mr-2 bg-secondary">
              {donation.foodType}
            </Badge>
            <Badge variant="outline" className="bg-secondary">
              {donation.quantity}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(true)}
              className="text-foodshare-600 hover:text-foodshare-700 hover:bg-foodshare-50 p-0"
            >
              View Details
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
            
            {currentUser?.role === 'recipient' && donation.status === 'available' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleReserve}
                className="bg-foodshare-500 hover:bg-foodshare-600 text-white"
              >
                Reserve
              </Button>
            )}
            
            {currentUser?.role === 'volunteer' && donation.status === 'reserved' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleComplete}
                className="bg-foodshare-500 hover:bg-foodshare-600 text-white"
              >
                Complete Delivery
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{donation.title}</DialogTitle>
            <DialogDescription>Donated by {donation.donorName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full h-56 overflow-hidden rounded-md">
              <img 
                src={donation.imageUrl} 
                alt={donation.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={`${statusColor[donation.status]} border-none`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{donation.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{donation.location}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Expires</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{new Date(donation.expiry).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Food Type</h4>
                <Badge variant="outline" className="bg-secondary">
                  {donation.foodType}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Quantity</h4>
                <Badge variant="outline" className="bg-secondary">
                  {donation.quantity}
                </Badge>
              </div>
            </div>
            
            {currentUser?.role === 'recipient' && donation.status === 'available' && (
              <Button 
                className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white" 
                onClick={() => {
                  handleReserve();
                  setShowDetails(false);
                }}
              >
                Reserve This Donation
              </Button>
            )}
            
            {currentUser?.role === 'volunteer' && donation.status === 'reserved' && (
              <Button 
                className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white" 
                onClick={() => {
                  handleComplete();
                  setShowDetails(false);
                }}
              >
                Mark Delivery as Completed
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationCard;
