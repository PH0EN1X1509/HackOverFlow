
import { RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

interface RefreshViewProps {
  setActiveView: (view: string) => void;
}

const RefreshView = ({ setActiveView }: RefreshViewProps) => {
  useEffect(() => {
    // Automatically return to overview after a delay
    const timer = setTimeout(() => {
      setActiveView('overview');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [setActiveView]);

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
