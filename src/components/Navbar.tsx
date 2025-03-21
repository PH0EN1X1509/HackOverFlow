import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Track current active section
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    // Update active link when location changes
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isLinkActive = (link) => {
    return activeLink === link ? 'text-foodshare-500' : 'text-foreground/80';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-900/80' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group" aria-label="FoodShare Logo">
          <div className="w-8 h-8 rounded-full bg-foodshare-500 flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-white font-semibold text-sm">FS</span>
          </div>
          <span className="font-semibold text-lg transition-colors duration-300">
            Food<span className="text-foodshare-500">Share</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`hover:text-foodshare-600 transition-colors ${isLinkActive('/')}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`hover:text-foodshare-600 transition-colors ${isLinkActive('/about')}`}
          >
            About Us
          </Link>
          <Link
            to="/how-it-works"
            className={`hover:text-foodshare-600 transition-colors ${isLinkActive('/how-it-works')}`}
          >
            How It Works
          </Link>
          
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <Link to="/dashboard">
                <Button variant="outline" className="border-foodshare-200 hover:border-foodshare-400">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/signin">
                <Button variant="ghost" className="hover:text-foodshare-600">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-foodshare-500 hover:bg-foodshare-600 text-white transition-colors">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20 animate-fade-in">
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            <Link
              to="/"
              className={`text-lg font-medium hover:text-foodshare-500 transition-colors ${isLinkActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-lg font-medium hover:text-foodshare-500 transition-colors ${isLinkActive('/about')}`}
            >
              About Us
            </Link>
            <Link
              to="/how-it-works"
              className={`text-lg font-medium hover:text-foodshare-500 transition-colors ${isLinkActive('/how-it-works')}`}
            >
              How It Works
            </Link>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {currentUser ? (
                <div className="flex flex-col space-y-4">
                  <Link to="/dashboard">
                    <Button className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link to="/signin">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white">
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
