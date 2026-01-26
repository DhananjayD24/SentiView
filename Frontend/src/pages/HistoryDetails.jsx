import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { AnalysisResults } from "@/components/analyzer/AnalysisResults";
import { apiFetch } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const HistoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await apiFetch(`/api/history/${id}`);
        setResult(data);
      } catch (error) {
        toast({
          title: "Failed to load analysis",
          description: error.message,
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 sm:pt-32 text-center text-sm sm:text-base text-muted-foreground">
          Loading analysis...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 sm:mb-4 text-sm text-muted-foreground hover:text-primary transition"
          >
            ← Back to History
          </button>

          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Analysis Details
            </h1>
          </div>

          {result && <AnalysisResults result={result} />}
        </div>
      </main>
    </div>
  );
};

export default HistoryDetails;
