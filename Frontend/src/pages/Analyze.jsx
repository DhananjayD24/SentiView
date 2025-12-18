import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AnalyzerInput } from '@/components/analyzer/AnalyzerInput';
import { AnalysisResults } from '@/components/analyzer/AnalysisResults';
import { dummyAnalysisResult } from '@/data/dummyData';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api';

const Analyze = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (input, mode) => {
  setIsAnalyzing(true);

  try {
    const data = await apiFetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        type: mode === "link" ? "product" : "text",
        content: input,
      }),
    });

    // backend may return { result } or just result
    setResults(data.result ?? data);

    toast({
      title: "Analysis Complete",
      description: "Your sentiment analysis is ready to view.",
    });
  } catch (error) {
    toast({
      title: "Analysis Failed",
      description: error.message || "Unable to analyze right now.",
      variant: "destructive",
    });
  } finally {
    setIsAnalyzing(false);
  }
};

  const handleSave = () => {
    toast({
      title: 'Product Saved',
      description: 'This product has been added to your saved list.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Analyze Product Reviews
            </h1>
            <p className="text-muted-foreground">
              Get instant sentiment insights from any product
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <AnalyzerInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          </div>

          {results && (
            <AnalysisResults result={results} onSave={handleSave} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Analyze;