import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HistoryList } from '@/components/dashboard/HistoryList';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  const fetchHistory = async () => {
    try {
      const data = await apiFetch('/api/history');
      setHistory(data);
    } catch (error) {
      toast({
        title: 'Failed to load history',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [isAuthenticated, navigate]);


  const handleSelectHistory = (id) => {
    // Navigate to analysis details
    navigate(`/history/${id}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleDeleteHistory = async (id) => {
  try {
    await apiFetch(`/api/history/${id}`, {
      method: "DELETE",
    });

    // Optimistic UI update
    setHistory((prev) => prev.filter((item) => item._id !== id));

    toast({
      title: "Analysis deleted",
      description: "The analysis has been removed from your history.",
    });
  } catch (error) {
    toast({
      title: "Delete failed",
      description: error.message,
      variant: "destructive",
    });
  }
};


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

          <HistoryList history={history} onSelect={handleSelectHistory} onDelete={handleDeleteHistory} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;