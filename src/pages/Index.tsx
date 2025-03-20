
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { ArrowRight, ShieldCheck, Truck, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = [
    {
      quote: "FoodShare has transformed how our restaurant handles excess food. Instead of throwing it away, we can now easily connect with those who need it most.",
      author: "Sarah J.",
      role: "Restaurant Owner",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "As a shelter coordinator, this platform has been a game-changer. We now receive a steady stream of quality food donations that help us serve our community better.",
      author: "Michael T.",
      role: "Shelter Director",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "I volunteer as a driver, and FoodShare makes it so easy to see where I'm needed and coordinate pickups and deliveries. The impact is immediate and rewarding.",
      author: "Priya K.",
      role: "Volunteer",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const stats = [
    { 
      label: "Food Waste Reduced", 
      value: "4.2 tons", 
      icon: ShieldCheck, 
      color: "bg-green-50 text-green-600" 
    },
    { 
      label: "Active Communities", 
      value: "128+", 
      icon: UtensilsCrossed, 
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      label: "Successful Deliveries", 
      value: "3,847", 
      icon: Truck, 
      color: "bg-amber-50 text-amber-600" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Features />
        
        {/* Stats Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="p-8 rounded-xl border border-border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`mx-auto w-14 h-14 rounded-full ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-secondary/50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of users already making a difference in their communities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-border/50 animate-fade-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="mb-4">{Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}</div>
                  <p className="mb-6 text-foreground/80 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="bg-foodshare-500 text-white rounded-2xl overflow-hidden shadow-xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-foodshare-600 to-foodshare-500 opacity-90"></div>
              
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                {Array(20).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-16 h-16 border border-white/30 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 px-6 py-16 md:px-12 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
                <p className="text-white/80 text-lg mb-8">
                  Join our growing community of donors, recipients, and volunteers working together 
                  to reduce food waste and address hunger in our communities.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/signup">
                    <Button size="lg" className="bg-white text-foodshare-600 hover:bg-foodshare-50 hover:text-foodshare-700 border-none">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
