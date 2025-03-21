import { useState, useEffect } from 'react';
import { Clock, MapPin, ExternalLink, Award, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  onDelete?: (id: string) => void;
}

const DonationCard = ({ donation, onStatusChange, onDelete }: DonationCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { currentUser } = useAuth();
  
  const isOwnDonation = currentUser?.id === donation.donorId;
  
  const handleReserve = async () => {
    try {
      if (onStatusChange) {
        await onStatusChange(donation.id, 'reserved');
        setShowDetails(false);
        toast.success("Donation reserved successfully!");
      }
    } catch (error) {
      console.error('Failed to reserve donation:', error);
      toast.error("Failed to reserve donation. Please try again.");
    }
  };
  
  const handleComplete = () => {
    if (onStatusChange) {
      onStatusChange(donation.id, 'completed');
      toast.success("Donation marked as completed!");
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(donation.id);
      setShowDeleteDialog(false);
      setShowDetails(false);
      toast.success("Donation deleted successfully!");
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

  useEffect(() => {
    // This effect will run whenever the donation prop changes
    // This ensures the card updates when the parent component receives new donation data
  }, [donation]);

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
            
            {donation.status === 'reserved' && (
              <Badge className="bg-yellow-100 text-yellow-800 border-none dark:bg-yellow-900/30 dark:text-yellow-400 ml-auto">
                Reserved
              </Badge>
            )}
            
            {isOwnDonation && donation.status === 'reserved' && (
              <div className="ml-auto flex">
                <Badge className="bg-yellow-100 text-yellow-800 border-none dark:bg-yellow-900/30 dark:text-yellow-400">
                  Reserved
                </Badge>
              </div>
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
            
            {isOwnDonation && donation.status === 'available' && (
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Donation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this donation? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
            
            {donation.status === 'reserved' && currentUser?.role === 'recipient' && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-yellow-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Reserved by You</h4>
                  <p className="text-xs text-yellow-700">This donation is currently reserved by you for pickup.</p>
                </div>
              </div>
            )}
            
            {donation.status === 'reserved' && isOwnDonation && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center mb-2">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <h4 className="text-sm font-medium text-yellow-800">This Donation Has Been Reserved</h4>
                </div>
                <p className="text-xs text-yellow-700">
                  A recipient has reserved this donation. They should pick it up before the expiration date. 
                  The donation is no longer available to others.
                </p>
              </div>
            )}
            
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
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              {currentUser?.role === 'recipient' && donation.status === 'available' && (
                <Button 
                  className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white" 
                  onClick={handleReserve}
                >
                  Reserve This Donation
                </Button>
              )}
              
              {currentUser?.role === 'recipient' && donation.status === 'reserved' && (
                <div className="w-full flex flex-col">
                  <p className="text-sm text-muted-foreground mb-2 text-center">
                    Please pick up the food by the expiration date. Contact support if you need to cancel your reservation.
                  </p>
                </div>
              )}
              
              {isOwnDonation && donation.status === 'reserved' && (
                <div className="w-full flex flex-col">
                  <p className="text-sm text-muted-foreground mb-2 text-center">
                    This donation has been reserved by a recipient. You will be notified when it is picked up.
                  </p>
                </div>
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
              
              {isOwnDonation && donation.status === 'available' && (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Donation
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationCard;
