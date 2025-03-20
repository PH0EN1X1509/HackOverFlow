
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  ListPlus, 
  Clock, 
  UserCog,
  BarChart4,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const DashboardNavigation = () => {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const [activeItem, setActiveItem] = useState<string>('');

  useEffect(() => {
    // Set the active item based on the current pathname
    const path = pathname.split('/').pop() || '';
    setActiveItem(path === 'dashboard' ? 'overview' : path);
  }, [pathname]);

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: 'overview',
        label: 'Overview',
        icon: LayoutGrid,
        href: '/dashboard',
      },
      {
        name: 'profile',
        label: 'Profile',
        icon: UserCog,
        href: '/dashboard/profile',
      },
      {
        name: 'messages',
        label: 'Messages',
        icon: MessageSquare,
        href: '/dashboard/messages',
      },
    ];

    const roleSpecificItems = {
      donor: [
        {
          name: 'donate',
          label: 'Create Listing',
          icon: ListPlus,
          href: '/dashboard/donate',
        },
        {
          name: 'history',
          label: 'Donation History',
          icon: Clock,
          href: '/dashboard/history',
        },
        {
          name: 'impact',
          label: 'My Impact',
          icon: BarChart4,
          href: '/dashboard/impact',
        },
      ],
      recipient: [
        {
          name: 'available',
          label: 'Available Food',
          icon: ListPlus,
          href: '/dashboard/available',
        },
        {
          name: 'reserved',
          label: 'My Reservations',
          icon: Clock,
          href: '/dashboard/reserved',
        }
      ],
      volunteer: [
        {
          name: 'deliveries',
          label: 'Pending Deliveries',
          icon: Clock,
          href: '/dashboard/deliveries',
        },
        {
          name: 'completed',
          label: 'Completed Deliveries',
          icon: BarChart4,
          href: '/dashboard/completed',
        }
      ]
    };

    return [
      ...baseItems,
      ...(currentUser?.role && roleSpecificItems[currentUser.role] || [])
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex w-full md:w-auto overflow-x-auto md:flex-col rounded-lg shadow-sm sticky top-4 bg-white dark:bg-gray-900 border">
      <nav className="w-full md:w-56 p-2 flex md:flex-col space-x-1 md:space-x-0 md:space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeItem === item.name
                ? "bg-foodshare-50 text-foodshare-700 dark:bg-foodshare-900/20 dark:text-foodshare-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardNavigation;
