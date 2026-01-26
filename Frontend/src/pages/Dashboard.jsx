import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { HistoryList } from "@/components/dashboard/HistoryList";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await apiFetch("/api/history");
        setHistory(data);
      } catch (error) {
        toast({
          title: "Failed to load history",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, navigate]);

  const handleSelectHistory = (id) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 sm:pt-32 text-center text-sm sm:text-base text-muted-foreground">
          Loading History...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 shrink-0">
                <History className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  Analysis History
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  View your past product analyses
                </p>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <History className="h-7 w-7 text-primary" />
              </div>

              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                No analyses yet
              </h2>

              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                You haven’t analyzed any products yet. Learn how to use
                SentiView and start analyzing Amazon reviews in minutes.
              </p>

              <Link to="/#how-it-works">
                <Button variant="hero" size="lg">
                  How to Use SentiView
                </Button>
              </Link>
            </div>
          ) : (
            <HistoryList
              history={history}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
