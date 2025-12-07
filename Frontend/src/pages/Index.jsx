import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { AnalyzerInput } from '@/components/analyzer/AnalyzerInput';
import { AnalysisResults } from '@/components/analyzer/AnalysisResults';
import { dummyAnalysisResult } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (input, mode) => {
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use dummy data for demo
    setResults({
      ...dummyAnalysisResult,
      productName: mode === 'link' ? 'Product from ' + new URL(input).hostname : 'Custom Reviews Analysis',
      productLink: mode === 'link' ? input : undefined,
    });
    
    setIsAnalyzing(false);
    toast({
      title: 'Analysis Complete',
      description: 'Your sentiment analysis is ready to view.',
    });
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
      
      <main>
        <Hero />
        
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Try It Now
              </h2>
              <p className="text-muted-foreground">
                Paste a product link or reviews to see the analysis in action
              </p>
            </div>
            
            <AnalyzerInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          </div>
        </section>

        {results && (
          <section className="py-8 px-4 pb-20">
            <div className="container mx-auto max-w-4xl">
              <AnalysisResults result={results} onSave={handleSave} />
            </div>
          </section>
        )}
      </main>
      
      <footer className="border-t py-8"
      style={{ borderColor: "hsl(var(--border))" }}>
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SentiView. Analyze smarter, decide better.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;