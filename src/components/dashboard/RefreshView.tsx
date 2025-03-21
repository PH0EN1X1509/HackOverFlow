import { RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

interface RefreshViewProps {
  setActiveView: (view: string) => void;
  onRefresh?: () => Promise<void>;
}

const RefreshView = ({ setActiveView, onRefresh }: RefreshViewProps) => {
  useEffect(() => {
    const refreshData = async () => {
      if (onRefresh) {
        try {
          await onRefresh();
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      }
      
      // Automatically return to overview after a delay
      setTimeout(() => {
        setActiveView('overview');
      }, 1500);
    };
    
    refreshData();
  }, [setActiveView, onRefresh]);
  
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <RefreshCcw className="h-8 w-8 text-muted-foreground animate-rotate-360" />
      </div>
      <h3 className="text-xl font-semibold">Refreshing Dashboard</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Please wait while we update your information...
      </p>
    </div>
  );
};

export default RefreshView;
