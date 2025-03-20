
import { UserPlus } from 'lucide-react';

const DefaultView = () => {
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
};

export default DefaultView;
