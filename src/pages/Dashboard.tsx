
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, BarChart2, MapIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import DashboardNavigation from '@/components/DashboardNavigation';
import { DonationItem } from '@/components/DonationCard';
import { DonationFormValues } from '@/components/DonationForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { NotificationItem } from '@/components/dashboard/types';

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

const MOCK_DONATIONS: DonationItem[] = [
  {
    id: '1',
    title: 'Fresh Sandwich Platter',
    description: 'Assorted sandwich platter from catered event. Contains various fillings including vegetarian options.',
    donorName: 'City Catering Co.',
    donorId: '1',
    location: '123 Main St, Downtown',
    expiry: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    quantity: 'Medium (4-10 meals)',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    foodType: 'Prepared Meals',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    title: 'Bakery Items Assortment',
    description: 'Day-old breads, pastries, and baked goods. Still fresh and delicious.',
    donorName: 'Fresh Bake Bakery',
    donorId: '2',
    location: '456 Oak Ave, Westside',
    expiry: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days from now
    quantity: 'Large (11-25 meals)',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    foodType: 'Bread & Baked',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    title: 'Fresh Produce Box',
    description: 'Mixed vegetables and fruits. Some items may have minor blemishes but all are perfectly edible.',
    donorName: 'Green Grocers',
    donorId: '3',
    location: '789 Market St, Eastside',
    expiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    quantity: 'Medium (4-10 meals)',
    status: 'reserved',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    foodType: 'Fresh Produce',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: '4',
    title: 'Pasta & Sauce Meal Kits',
    description: 'Restaurant-quality pasta with separate containers of sauce. Ready to heat and serve.',
    donorName: 'Pasta Palace',
    donorId: '1',
    location: '321 Pine St, Northside',
    expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    quantity: 'Small (1-3 meals)',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    foodType: 'Prepared Meals',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
  },
  {
    id: '5',
    title: 'Canned Food Assortment',
    description: 'Various canned goods including vegetables, beans, and soups. All within expiration date.',
    donorName: 'Community Pantry',
    donorId: '3',
    location: '567 Elm St, Southside',
    expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    quantity: 'Large (11-25 meals)',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    foodType: 'Canned Goods',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
  },
  {
    id: '6',
    title: 'Fruit Smoothie Packs',
    description: 'Pre-packaged smoothie ingredients ready to blend. Contains various fruits and yogurt.',
    donorName: 'Health Juice Bar',
    donorId: '2',
    location: '890 Cedar Rd, Westside',
    expiry: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    quantity: 'Medium (4-10 meals)',
    status: 'reserved',
    imageUrl: 'https://images.unsplash.com/photo-1593759608142-e08b84568198?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    foodType: 'Beverages',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
];

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
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [donations, setDonations] = useState<DonationItem[]>(MOCK_DONATIONS);
  const [activeView, setActiveView] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const getFilteredDonations = (status?: DonationItem['status']) => {
    if (!currentUser) return [];
    
    let filtered = [...donations];
    
    if (status) {
      filtered = filtered.filter(donation => donation.status === status);
    }
    
    if (currentUser.role === 'donor') {
      filtered = filtered.filter(donation => donation.donorId === currentUser.id);
    } else if (currentUser.role === 'volunteer') {
      if (!status) {
        filtered = filtered.filter(donation => 
          donation.status === 'reserved' || donation.status === 'completed'
        );
      }
    }
    
    return filtered;
  };

  const handleStatusChange = (id: string, newStatus: DonationItem['status']) => {
    setDonations(donations.map(donation => 
      donation.id === id ? { ...donation, status: newStatus } : donation
    ));
  };

  const handleAddDonation = (formData: DonationFormValues) => {
    if (!currentUser) return;
    
    const newDonation: DonationItem = {
      id: `donation_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      donorName: currentUser.name,
      donorId: currentUser.id,
      location: formData.location,
      expiry: formData.expiry.toISOString(),
      quantity: formData.quantity,
      status: 'available',
      imageUrl: formData.imageUrl,
      foodType: formData.foodType,
      createdAt: new Date().toISOString(),
    };
    
    setDonations([newDonation, ...donations]);
    toast.success("Donation created successfully!");
    setActiveView('overview');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!currentUser && !isLoading) {
      navigate('/signin');
    }
  }, [currentUser, isLoading, navigate]);

  if (!currentUser) {
    return null;
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
          />
        );
        
      case 'deliveries':
        return (
          <DeliveriesView 
            getFilteredDonations={getFilteredDonations} 
            handleStatusChange={handleStatusChange} 
          />
        );
        
      case 'reserved':
        return (
          <ReservationsView 
            getFilteredDonations={getFilteredDonations} 
            handleStatusChange={handleStatusChange}
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
        return <RefreshView setActiveView={setActiveView} />;
        
      default:
        return <DefaultView />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {isLoading ? (
          <LoadingView />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <div className="hidden md:block">
              <DashboardNavigation />
            </div>
            
            <div className="overflow-hidden md:overflow-visible">
              {renderMainContent()}
            </div>
            
            <div className="md:hidden sticky bottom-0 left-0 right-0 border-t bg-background p-2 z-20">
              <div className="overflow-x-auto pb-2">
                <DashboardNavigation />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
