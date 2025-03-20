import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, BarChart2, Utensils, Map, MessageSquare, RefreshCcw,
  Bell, UserPlus, Calendar, Users, ArrowRight, ListFilter,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import DashboardNavigation from '@/components/DashboardNavigation';
import DonationCard, { DonationItem } from '@/components/DonationCard';
import DonationForm, { DonationFormValues } from '@/components/DonationForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

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

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

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

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    toast.success("All notifications marked as read");
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
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {currentUser.name}!
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2 md:mt-0"
                onClick={() => setActiveView('refresh')}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            <Tabs defaultValue="activity" className="w-full">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Donations
                      </CardTitle>
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getFilteredDonations('available').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {currentUser.role === 'donor' 
                          ? '+2 from last week' 
                          : 'in your area'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {currentUser.role === 'donor' 
                          ? 'Reserved Items' 
                          : currentUser.role === 'recipient'
                            ? 'Your Reservations'
                            : 'Pending Deliveries'}
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getFilteredDonations('reserved').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        awaiting {currentUser.role === 'volunteer' ? 'delivery' : 'pickup'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {currentUser.role === 'donor' 
                          ? 'Community Impact' 
                          : 'Recent Activity'}
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentUser.role === 'donor' 
                          ? '24 meals' 
                          : '12 actions'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {currentUser.role === 'donor' 
                          ? 'provided this month' 
                          : 'in the last 30 days'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Messages
                      </CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        3
                      </div>
                      <p className="text-xs text-muted-foreground">
                        unread conversations
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your latest interactions on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getFilteredDonations().slice(0, 3).map((donation) => (
                          <div key={donation.id} className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
                              <Utensils className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{donation.title}</p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {donation.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {getFilteredDonations().length === 0 && (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                              <Utensils className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No Activity Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                              {currentUser.role === 'donor' 
                                ? 'Start by creating your first donation listing' 
                                : currentUser.role === 'recipient'
                                  ? 'Browse available donations and make your first reservation'
                                  : 'Check for delivery requests in your area'}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Notifications</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllNotificationsAsRead}
                          className="text-xs h-7 px-2"
                        >
                          Mark all read
                        </Button>
                      </div>
                      <CardDescription>
                        Stay updated on platform activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-2">
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              className={`p-3 rounded-lg border ${
                                notification.read 
                                  ? 'bg-transparent border-border/50' 
                                  : 'bg-secondary/50 border-secondary'
                              }`}
                            >
                              {!notification.read && (
                                <div className="flex items-center mb-2">
                                  <div className="w-2 h-2 rounded-full bg-foodshare-500 mr-2"></div>
                                  <span className="text-xs text-foodshare-600">New</span>
                                </div>
                              )}
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs h-6 px-2"
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          {notifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">No notifications</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Recent Donations</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <ListFilter className="h-3.5 w-3.5 mr-1" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>All Donations</DropdownMenuItem>
                      <DropdownMenuItem>Available</DropdownMenuItem>
                      <DropdownMenuItem>Reserved</DropdownMenuItem>
                      <DropdownMenuItem>Completed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredDonations().slice(0, 3).map((donation) => (
                    <DonationCard 
                      key={donation.id} 
                      donation={donation} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  
                  {getFilteredDonations().length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Utensils className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">No Donations Found</h3>
                      <p className="text-sm text-muted-foreground max-w-md mt-2 mb-6">
                        {currentUser.role === 'donor' 
                          ? 'You haven\'t created any donations yet. Start by listing your first donation.' 
                          : 'There are no donations matching your criteria at this time.'}
                      </p>
                      
                      {currentUser.role === 'donor' && (
                        <Button 
                          onClick={() => setActiveView('donate')}
                          className="bg-foodshare-500 hover:bg-foodshare-600 text-white"
                        >
                          Create Donation
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="donations" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">All Donations</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <ListFilter className="h-3.5 w-3.5 mr-1" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>All Donations</DropdownMenuItem>
                      <DropdownMenuItem>Available</DropdownMenuItem>
                      <DropdownMenuItem>Reserved</DropdownMenuItem>
                      <DropdownMenuItem>Completed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredDonations().map((donation) => (
                    <DonationCard 
                      key={donation.id} 
                      donation={donation} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  
                  {getFilteredDonations().length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Utensils className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">No Donations Found</h3>
                      <p className="text-sm text-muted-foreground max-w-md mt-2 mb-6">
                        {currentUser.role === 'donor' 
                          ? 'You haven\'t created any donations yet. Start by listing your first donation.' 
                          : 'There are no donations matching your criteria at this time.'}
                      </p>
                      
                      {currentUser.role === 'donor' && (
                        <Button 
                          onClick={() => setActiveView('donate')}
                          className="bg-foodshare-500 hover:bg-foodshare-600 text-white"
                        >
                          Create Donation
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <LineChart className="mr-2 h-4 w-4" />
                        {currentUser.role === 'donor' 
                          ? 'Your Donation Activity' 
                          : currentUser.role === 'recipient'
                            ? 'Food Received'
                            : 'Delivery Activity'}
                      </CardTitle>
                      <CardDescription>
                        {currentUser.role === 'donor' 
                          ? 'Donations over time' 
                          : currentUser.role === 'recipient'
                            ? 'Food received over time'
                            : 'Deliveries completed over time'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">Chart visualization will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Map className="mr-2 h-4 w-4" />
                        Geographic Impact
                      </CardTitle>
                      <CardDescription>
                        Communities you've helped
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">Map visualization will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Summary</CardTitle>
                    <CardDescription>
                      Your contribution to reducing waste and fighting hunger
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-secondary/50 rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Meals Shared</p>
                          <h3 className="text-2xl font-bold">
                            {currentUser.role === 'donor' ? '42' : currentUser.role === 'recipient' ? '89' : '156'}
                          </h3>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Food Saved (kg)</p>
                          <h3 className="text-2xl font-bold">
                            {currentUser.role === 'donor' ? '68' : currentUser.role === 'recipient' ? '142' : '275'}
                          </h3>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">CO₂ Reduced</p>
                          <h3 className="text-2xl font-bold">
                            {currentUser.role === 'donor' ? '38' : currentUser.role === 'recipient' ? '78' : '145'}
                            <span className="text-sm">kg</span>
                          </h3>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Top Food Categories</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Prepared Meals</span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="bg-foodshare-500 h-full" style={{ width: '70%' }}></div>
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">70%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Fresh Produce</span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="bg-foodshare-500 h-full" style={{ width: '45%' }}></div>
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">45%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Bakery Items</span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="bg-foodshare-500 h-full" style={{ width: '30%' }}></div>
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">30%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case 'donate':
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
        
      case 'available':
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
        
      case 'deliveries':
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
        
      case 'reserved':
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
        
      case 'refresh':
        setActiveView('overview');
        return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <RefreshCcw className="h-8 w-8 text-muted-foreground animate-rotate-360" />
            </div>
            <h3 className="text-xl font-semibold">Refreshing Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait while we update your information...
            </p>
          </div>
        );
        
      default:
        return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Feature Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This section is still under development. Check back soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {isLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <RefreshCcw className="h-8 w-8 text-muted-foreground animate-rotate-360" />
            </div>
            <h3 className="text-xl font-semibold">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait while we load your dashboard...
            </p>
          </div>
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
