import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DashboardNavigation from '@/components/DashboardNavigation';
import { DonationItem } from '@/components/DonationCard';
import { DonationFormValues } from '@/components/DonationForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { NotificationItem } from '@/components/dashboard/types';
import { apiMethods } from '@/services/api';

// Import all dashboard view components
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DefaultView from '@/components/dashboard/DefaultView';
import LoadingView from '@/components/dashboard/LoadingView';
import RefreshView from '@/components/dashboard/RefreshView';
import ReservationsView from '@/components/dashboard/ReservationsView';
import AvailableDonationsView from '@/components/dashboard/AvailableDonationsView';
import DeliveriesView from '@/components/dashboard/DeliveriesView';
import MapView from '@/components/dashboard/MapView';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import EducationalContent from '@/components/EducationalContent';
import DonationView from '@/components/dashboard/DonationView';

// Using mock notifications for now
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Donation Available',
    description: 'Fresh Sandwich Platter has been listed near your location',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'Donation Reserved',
    description: 'Your "Bakery Items Assortment" has been reserved',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Delivery Completed',
    description: 'Pasta & Sauce Meal Kits was successfully delivered',
    time: 'Yesterday',
    read: true,
  },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [activeView, setActiveView] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Redirect to overview if at dashboard root
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate('/dashboard/overview', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const donationData = await apiMethods.getDonations();
      setDonations(donationData);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFilteredDonations = (status?: DonationItem['status']) => {
    if (!currentUser) return [];
    
    let filtered = [...donations];
    
    // Apply status filter if provided
    if (status) {
      filtered = filtered.filter(donation => donation.status === status);
    }
    
    // Apply role-based filtering
    if (currentUser.role === 'donor') {
      // Donors should only see their own donations, regardless of status
      filtered = filtered.filter(donation => donation.donorId === currentUser.id);
    } else if (currentUser.role === 'volunteer') {
      // Volunteers should only see reserved or completed donations (unless a specific status is requested)
      if (!status) {
        filtered = filtered.filter(donation => 
          donation.status === 'reserved' || donation.status === 'completed'
        );
      }
    }
    // Recipients see all available donations, or their reserved ones
    
    return filtered;
  };

  const handleStatusChange = async (id: string, newStatus: DonationItem['status']) => {
    try {
      // Update UI optimistically for better user experience
      setDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === id ? { ...donation, status: newStatus } : donation
        )
      );
      
      // Then update on server
      await apiMethods.updateDonationStatus(id, newStatus);
      
      // Show success message based on the action
      if (newStatus === 'reserved') {
        toast.success("Donation reserved successfully!");
      } else if (newStatus === 'completed') {
        toast.success("Donation marked as completed!");
      }
      
      // Fetch fresh data in the background to ensure consistency
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast.error('Failed to update donation status. Please try again.');
      
      // Revert the optimistic update if the server call failed
      fetchDonations();
    }
  };

  const handleDeleteDonation = async (id: string) => {
    try {
      await apiMethods.deleteDonation(id);
      
      // Update local state by removing the deleted donation
      setDonations(prevDonations => 
        prevDonations.filter(donation => donation.id !== id)
      );
      
      toast.success("Donation deleted successfully!");
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error('Failed to delete donation. Please try again.');
    }
  };

  const handleAddDonation = async (formData: DonationFormValues) => {
    if (!currentUser) return;
    
    try {
      // Check if we're using a custom image that's too large (>2MB)
      if (formData.imageUrl?.startsWith('data:image')) {
        const approximateSize = formData.imageUrl.length * 0.75; // Approximate size in bytes
        if (approximateSize > 2 * 1024 * 1024) {
          toast.error('Image too large. Please use a smaller image or choose from the presets.');
          return;
        }
      }
      
      const donationData = {
        title: formData.title,
        description: formData.description,
        donorName: currentUser.name,
        donorId: currentUser.id,
        location: formData.location,
        expiry: formData.expiry.toISOString(),
        quantity: formData.quantity,
        imageUrl: formData.imageUrl || '', // Handle null/undefined
        foodType: formData.foodType,
      };
      
      const response = await apiMethods.createDonation(donationData);
      
      // Add the new donation to the local state
      setDonations(prevDonations => [response.donation, ...prevDonations]);
      toast.success("Donation created successfully!");
      
      // Navigate back to overview after successful donation creation
      setActiveView('overview');
      navigate('/dashboard/overview', { replace: true });
    } catch (error) {
      console.error('Error creating donation:', error);
      if (error.message?.includes('Image too large')) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create donation. Please try again.');
      }
    }
  };

  // Update activeView whenever the URL path changes
  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'overview';
    setActiveView(path);
  }, [location.pathname]);

  useEffect(() => {
    if (currentUser) {
      fetchDonations();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && !isLoading) {
      navigate('/signin');
    }
  }, [currentUser, isLoading, navigate]);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect to overview if at dashboard root
  if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    return <Navigate to="/dashboard/overview" replace />;
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <DashboardOverview 
            currentUser={currentUser}
            notifications={notifications}
            setNotifications={setNotifications}
            getFilteredDonations={getFilteredDonations}
            handleStatusChange={handleStatusChange}
            handleDeleteDonation={handleDeleteDonation}
            setActiveView={setActiveView}
          />
        );
      
      case 'donate':
        return <DonationView handleAddDonation={handleAddDonation} />;
        
      case 'available':
        return (
          <AvailableDonationsView 
            getFilteredDonations={getFilteredDonations} 
            handleStatusChange={handleStatusChange}
            handleDeleteDonation={handleDeleteDonation} 
          />
        );
        
      case 'deliveries':
        return (
          <DeliveriesView 
            getFilteredDonations={getFilteredDonations} 
            handleStatusChange={handleStatusChange}
            handleDeleteDonation={handleDeleteDonation}
          />
        );
        
      case 'reserved':
        return (
          <ReservationsView 
            getFilteredDonations={getFilteredDonations} 
            handleStatusChange={handleStatusChange}
            handleDeleteDonation={handleDeleteDonation}
            setActiveView={setActiveView}
          />
        );
        
      case 'analytics':
        return <AnalyticsDashboard />;
        
      case 'education':
        return <EducationalContent />;
        
      case 'map':
        return <MapView />;
        
      case 'refresh':
        return <RefreshView setActiveView={setActiveView} onRefresh={fetchDonations} />;
        
      default:
        return <DefaultView />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && donations.length === 0 ? (
          <LoadingView />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <div className="hidden md:block">
              <DashboardNavigation setActiveView={setActiveView} currentView={activeView} />
            </div>
            
            <div className="overflow-hidden md:overflow-visible">
              {renderMainContent()}
            </div>
            
            <div className="md:hidden sticky bottom-0 left-0 right-0 border-t bg-background p-2 z-20">
              <div className="overflow-x-auto pb-2">
                <DashboardNavigation setActiveView={setActiveView} currentView={activeView} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
