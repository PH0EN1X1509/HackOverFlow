
import { AppleIcon, UtensilsCrossed, Truck, Award, Users, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <AppleIcon className="h-6 w-6" />,
    title: "Food Waste Reduction",
    description: "Transform surplus food into valuable resources, reducing waste that would otherwise go to landfills."
  },
  {
    icon: <UtensilsCrossed className="h-6 w-6" />,
    title: "Donor Management",
    description: "Easily list available food, track donations, and see your direct community impact."
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Volunteer Network",
    description: "Join our dedicated volunteers who help collect and deliver food where it's needed most."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Recipient Support",
    description: "Shelters and food banks can browse and request available donations in real-time."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Impact Tracking",
    description: "Visualize your contribution with detailed metrics on meals provided and waste reduced."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Community Building",
    description: "Connect with like-minded individuals and organizations committed to food sustainability."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How FoodShare Works</h2>
          <p className="text-muted-foreground text-lg">
            Our platform connects food donors with recipients through a network of volunteers,
            making the process of food sharing seamless and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/40 group hover:border-foodshare-200"
            >
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-foodshare-50 text-foodshare-600 group-hover:bg-foodshare-100 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
