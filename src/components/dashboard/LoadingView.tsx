
import { RefreshCcw } from 'lucide-react';

const LoadingView = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <RefreshCcw className="h-8 w-8 text-muted-foreground animate-rotate-360" />
      </div>
      <h3 className="text-xl font-semibold">Loading Dashboard</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Please wait while we load your dashboard...
      </p>
    </div>
  );
};

export default LoadingView;
