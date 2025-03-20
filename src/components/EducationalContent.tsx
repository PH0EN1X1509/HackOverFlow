
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, LineChart, ArrowUpRight, Leaf, Apple, UtensilsCrossed } from "lucide-react";

const blogPosts = [
  {
    title: "Understanding Food Waste: Stats and Solutions",
    excerpt: "Every year, approximately one-third of all food produced for human consumption goes to waste. This not only represents a significant loss of resources but also contributes to environmental issues...",
    author: "Emma Johnson",
    date: "June 15, 2023",
    readTime: "5 min read",
    category: "Food Waste",
    icon: <LineChart className="h-4 w-4" />
  },
  {
    title: "Tips for Restaurants to Reduce Food Waste",
    excerpt: "Restaurants can implement several strategies to minimize food waste while maximizing profits. From inventory management to creative repurposing of ingredients, here are practical ways to make a difference...",
    author: "Michael Chen",
    date: "July 3, 2023",
    readTime: "7 min read",
    category: "Best Practices",
    icon: <UtensilsCrossed className="h-4 w-4" />
  },
  {
    title: "The Environmental Impact of Food Waste",
    excerpt: "Food waste that ends up in landfills produces a significant amount of methane – a greenhouse gas even more potent than carbon dioxide. By reducing food waste, we can help reduce greenhouse gas emissions...",
    author: "Sarah Williams",
    date: "August 12, 2023",
    readTime: "6 min read",
    category: "Environment",
    icon: <Leaf className="h-4 w-4" />
  }
];

const tips = [
  {
    title: "Proper Food Storage",
    description: "Learn the optimal ways to store different types of food to extend their freshness and prevent spoilage.",
    icon: <Apple className="h-5 w-5" />
  },
  {
    title: "Meal Planning",
    description: "Plan your meals in advance to buy only what you need and reduce the chance of food going bad before use.",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    title: "Creative Leftovers",
    description: "Transform yesterday's meals into new, exciting dishes instead of throwing them away.",
    icon: <Lightbulb className="h-5 w-5" />
  },
  {
    title: "Understand Expiration Dates",
    description: "Know the difference between 'sell by', 'use by', and 'best before' dates to avoid unnecessary waste.",
    icon: <UtensilsCrossed className="h-5 w-5" />
  },
  {
    title: "Composting Basics",
    description: "Turn food scraps into nutrient-rich soil instead of sending them to landfills.",
    icon: <Leaf className="h-5 w-5" />
  }
];

const infographics = [
  {
    title: "The Journey of Food Waste",
    description: "Follow the path of food waste from farm to landfill and learn about intervention points.",
    imageUrl: "https://images.unsplash.com/photo-1495570689053-812aa48e9a1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Food Waste By The Numbers",
    description: "Visual representation of global food waste statistics and their environmental impact.",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Saving Food at Home",
    description: "Practical tips for reducing food waste in your kitchen through smart storage and meal planning.",
    imageUrl: "https://images.unsplash.com/photo-1583608205776-babe6e89fb38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  }
];

const EducationalContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Food Waste Education</h1>
        <p className="text-muted-foreground mt-1">
          Learn about food waste and how to make a difference
        </p>
      </div>
      
      <Tabs defaultValue="articles" className="w-full">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="tips">Quick Tips</TabsTrigger>
          <TabsTrigger value="infographics">Infographics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs">
                      {post.icon}
                      <span className="ml-1">{post.category}</span>
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    By {post.author} on {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{post.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button variant="outline" className="w-full">
                    Read Full Article
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="bg-card border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center mb-4">
                    {tip.icon}
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="infographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {infographics.map((infographic, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={infographic.imageUrl} 
                    alt={infographic.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{infographic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{infographic.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Infographic
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationalContent;
