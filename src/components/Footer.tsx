
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-foodshare-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">FS</span>
              </div>
              <span className="font-semibold text-lg">
                Food<span className="text-foodshare-500">Share</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Reducing food waste and hunger through community connections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-foodshare-500 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FoodShare. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Made with 💚 for a more sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
