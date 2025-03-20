
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapComponent from '@/components/Map';

const MapView = () => {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Donation Map</h1>
        <p className="text-muted-foreground">
          See where food donations and needs are located
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Food Sharing Map</CardTitle>
          <CardDescription>
            View the locations of donors, recipients, and volunteers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-foodshare-500"></div>
              <span className="text-sm">Donors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm">Recipients</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Volunteers</span>
            </div>
          </div>
          <MapComponent height="500px" />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapView;
