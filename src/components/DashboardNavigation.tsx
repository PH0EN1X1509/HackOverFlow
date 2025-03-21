import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  MapPin, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  Truck,
  LineChart,
  BookOpen,
  Plus
} from "lucide-react";
import { useState, useEffect } from 'react';
import DonationForm from '@/components/DonationForm';

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  role?: "donor" | "recipient" | "volunteer" | "all";
}

interface DashboardNavigationProps {
  setActiveView?: React.Dispatch<React.SetStateAction<string>>;
  currentView?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "overview",
    role: "all",
  },
  {
    name: "Available Donations",
    icon: <Utensils className="h-4 w-4" />,
    href: "available",
    role: "recipient",
  },
  {
    name: "My Reservations",
    icon: <Calendar className="h-4 w-4" />,
    href: "reserved",
    role: "recipient",
  },
  {
    name: "Create Donation",
    icon: <Plus className="h-4 w-4" />,
    href: "donate",
    role: "donor",
  },
  {
    name: "Pending Deliveries",
    icon: <Truck className="h-4 w-4" />,
    href: "deliveries",
    role: "volunteer",
  },
  {
    name: "Donation Map",
    icon: <MapPin className="h-4 w-4" />,
    href: "map",
    role: "all",
  },
  {
    name: "Analytics",
    icon: <LineChart className="h-4 w-4" />,
    href: "analytics",
    role: "all",
  },
  {
    name: "Education",
    icon: <BookOpen className="h-4 w-4" />,
    href: "education",
    role: "all",
  },
  {
    name: "Community",
    icon: <Users className="h-4 w-4" />,
    href: "community",
    role: "all",
  },
  {
    name: "Settings",
    icon: <Settings className="h-4 w-4" />,
    href: "settings",
    role: "all",
  },
];

function getFilteredNavigation(role: string) {
  return navigationItems.filter(
    (item) => item.role === "all" || item.role === role
  );
}

const DashboardNavigation = ({ setActiveView, currentView }: DashboardNavigationProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  // Use the currentView prop if provided, otherwise use path from URL
  const currentPath = currentView || pathParts[pathParts.length - 1] || 'overview';
  const [showDonationForm, setShowDonationForm] = useState(false);

  // When component mounts, ensure "overview" is the default view
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      if (setActiveView) {
        setActiveView('overview');
      }
      navigate('/dashboard/overview', { replace: true });
    }
  }, []);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  // Filter navigation based on user role
  const filteredNavigation = currentUser
    ? getFilteredNavigation(currentUser.role)
    : [];

  const handleNavigate = (path: string) => {
    // Update activeView state if prop is provided
    if (setActiveView) {
      setActiveView(path);
    }
    navigate(`/dashboard/${path}`);
  };

  const handleCreateDonation = () => {
    // For larger screens, navigate to the donate page
    if (window.innerWidth >= 768) {
      if (setActiveView) {
        setActiveView('donate');
      }
      navigate('/dashboard/donate');
    } else {
      // For mobile, show modal
      setShowDonationForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowDonationForm(false);
    // Refresh the dashboard after donation is submitted
    if (setActiveView) {
      setActiveView('overview');
    }
    navigate('/dashboard/overview');
  };

  return (
    <>
      <div className="h-full flex flex-col md:flex-row md:h-auto">
        <div className="flex md:flex-col flex-1 md:space-y-1 p-1 overflow-x-auto md:overflow-y-auto md:w-52">
          <ScrollArea className="md:h-[calc(100vh-12rem)] w-full">
            <div className="flex md:flex-col gap-1 md:pb-0 pb-2">
              {filteredNavigation.map((item) => (
                <Button
                  key={item.name}
                  variant={currentPath === item.href ? "default" : "ghost"}
                  className={cn(
                    "justify-start md:w-full",
                    currentPath === item.href
                      ? "bg-foodshare-500 hover:bg-foodshare-500/90 text-white"
                      : ""
                  )}
                  onClick={() => handleNavigate(item.href)}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                  {currentPath === item.href && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Button>
              ))}
              
              {currentUser?.role === 'donor' && (
                <Button
                  variant="ghost"
                  className="justify-start md:hidden bg-foodshare-500 hover:bg-foodshare-500/90 text-white mt-4"
                  onClick={handleCreateDonation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Donation
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                className="justify-start md:hidden mt-2" 
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </ScrollArea>
          <div className="mt-auto pt-2 hidden md:block">
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Donation Form Modal - Only show in mobile view */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Donation</h2>
            <DonationForm onSubmit={(formData) => {
              // Call API to create donation
              try {
                // We can add API calls here later if needed
                handleCloseForm();
              } catch (error) {
                console.error('Error creating donation:', error);
              }
            }} />
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={handleCloseForm}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavigation;
