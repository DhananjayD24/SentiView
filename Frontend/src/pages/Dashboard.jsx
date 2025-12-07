import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HistoryList } from '@/components/dashboard/HistoryList';
import { useAuth } from '@/contexts/AuthContext';
import { dummyHistory } from '@/data/dummyData';
import { History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSelectHistory = (id) => {
    // Navigate to analysis details
    console.log('Selected:', id);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Analysis History</h1>
                <p className="text-sm text-muted-foreground">
                  View your past product analyses
                </p>
              </div>
            </div>
            
            <Link to="/analyze">
              <Button variant="glow">
                <Plus className="h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>

          <HistoryList history={dummyHistory} onSelect={handleSelectHistory} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;