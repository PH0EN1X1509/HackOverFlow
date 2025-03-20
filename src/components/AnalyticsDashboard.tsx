
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, LineChart, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie } from "recharts";
import { CircleUser, Utensils, CalendarClock, Users, MapPin, Trophy, Calculator } from "lucide-react";
import Map from "./Map";

const donationsData = [
  { month: "Jan", donations: 45, volunteers: 12, recipients: 9 },
  { month: "Feb", donations: 52, volunteers: 15, recipients: 11 },
  { month: "Mar", donations: 49, volunteers: 14, recipients: 10 },
  { month: "Apr", donations: 63, volunteers: 18, recipients: 13 },
  { month: "May", donations: 58, volunteers: 16, recipients: 12 },
  { month: "Jun", donations: 64, volunteers: 20, recipients: 15 },
  { month: "Jul", donations: 75, volunteers: 22, recipients: 16 },
  { month: "Aug", donations: 83, volunteers: 25, recipients: 19 },
  { month: "Sep", donations: 87, volunteers: 23, recipients: 17 },
  { month: "Oct", donations: 92, volunteers: 28, recipients: 21 },
  { month: "Nov", donations: 101, volunteers: 30, recipients: 24 },
  { month: "Dec", donations: 110, volunteers: 32, recipients: 26 }
];

const foodTypeData = [
  { name: "Prepared Meals", value: 42, color: "#10b981" },
  { name: "Fresh Produce", value: 28, color: "#f59e0b" },
  { name: "Bakery Items", value: 15, color: "#6366f1" },
  { name: "Canned Goods", value: 10, color: "#ef4444" },
  { name: "Beverages", value: 5, color: "#0ea5e9" }
];

const impactStats = [
  { 
    title: "Total Donations", 
    value: "879",
    icon: <Utensils className="h-4 w-4" />,
    description: "Food items donated"
  },
  { 
    title: "Active Volunteers", 
    value: "32",
    icon: <Users className="h-4 w-4" />,
    description: "Helping with deliveries"
  },
  { 
    title: "Communities Reached", 
    value: "17",
    icon: <MapPin className="h-4 w-4" />,
    description: "Local neighborhoods"
  },
  { 
    title: "Meals Provided", 
    value: "3,450",
    icon: <Trophy className="h-4 w-4" />,
    description: "People served"
  },
  { 
    title: "Food Waste Reduced", 
    value: "724",
    icon: <Calculator className="h-4 w-4" />,
    description: "kg diverted from landfill"
  },
  { 
    title: "CO₂ Reduction", 
    value: "1,328",
    icon: <CalendarClock className="h-4 w-4" />,
    description: "kg of emissions saved"
  }
];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      <p className="text-muted-foreground">
        Visualize the impact of your food sharing efforts
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {impactStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Donations, volunteers, and recipients over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="aspect-[4/3]" config={{
                  donations: { theme: { light: "#f97316", dark: "#f97316" } },
                  volunteers: { theme: { light: "#06b6d4", dark: "#06b6d4" } },
                  recipients: { theme: { light: "#8b5cf6", dark: "#8b5cf6" } }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={donationsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="donations" 
                        name="Donations"
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="volunteers" 
                        name="Volunteers"
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="recipients" 
                        name="Recipients"
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Food Distribution</CardTitle>
                <CardDescription>Breakdown by food category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="aspect-[4/3]" config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={foodTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {foodTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
              <CardDescription>Monthly donation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="aspect-[16/9]" config={{
                donations: { theme: { light: "#f97316", dark: "#f97316" } }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar 
                      dataKey="donations" 
                      name="Donations" 
                      fill="var(--color-donations, #f97316)" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CircleUser className="mr-2 h-4 w-4" />
                  Donor Leaderboard
                </CardTitle>
                <CardDescription>Top food contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Fresh Harvest Bakery", donations: 87, percent: 100 },
                    { name: "Green Grocers", donations: 75, percent: 86 },
                    { name: "Pasta Palace", donations: 64, percent: 74 },
                    { name: "City Catering Co.", donations: 52, percent: 60 },
                    { name: "Health Juice Bar", donations: 43, percent: 49 }
                  ].map((donor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="font-medium">{donor.name}</div>
                        </div>
                        <span className="text-muted-foreground text-sm">{donor.donations} items</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-foodshare-500 rounded-full" 
                          style={{ width: `${donor.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2 h-4 w-4" />
                  Food Categories
                </CardTitle>
                <CardDescription>Types of donated food</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {foodTypeData.map((type, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="font-medium">{type.name}</div>
                        <div className="text-muted-foreground text-sm">{type.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Impact</CardTitle>
              <CardDescription>Donation activity by location</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Map height="500px" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
