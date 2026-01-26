import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { AnalyzerInput } from "@/components/analyzer/AnalyzerInput";
import { AnalysisResults } from "@/components/analyzer/AnalysisResults";
import { dummyAnalysisResult } from "@/data/dummyData";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const EXTENSION_LINK =
  "https://chrome.google.com/webstore/detail/your-extension-id"; // 🔁 replace

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (input, mode) => {
    setIsAnalyzing(true);

    // Demo-only simulation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResults({
      ...dummyAnalysisResult,
      productName:
        mode === "link"
          ? "Product from " + new URL(input).hostname
          : "Custom Reviews Analysis",
      productLink: mode === "link" ? input : undefined,
    });

    setIsAnalyzing(false);
    toast({
      title: "Analysis Complete",
      description:
        "This is a demo analysis. Install the extension for real-time insights.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Login Required",
      description:
        "Please sign in to save products and view dashboard history.",
    });
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        // small delay to ensure DOM is ready
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* ================= HERO ================= */}
        <Hero />

        {/* ================= HOW IT WORKS ================= */}
        <section id="how-it-works" className="py-16 sm:py-20 lg:py-28 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 sm:mb-16">
              From Extension to Insights — in Minutes
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12">
              {/* STEP 1 */}
              <div className="flex flex-col items-center max-w-xs">
                <span className="text-primary text-xs font-semibold tracking-wider mb-2">
                  STEP 1
                </span>
                <h3 className="font-semibold mb-2">Install Chrome Extension</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Add SentiView to Chrome to analyze Amazon product reviews
                  instantly.
                </p>
              </div>

              <ArrowRight className="hidden lg:block w-10 h-10 text-primary/70" />

              {/* STEP 2 */}
              <div className="flex flex-col items-center max-w-xs">
                <span className="text-primary text-xs font-semibold tracking-wider mb-2">
                  STEP 2
                </span>
                <h3 className="font-semibold mb-2">Login to SentiView</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Sign in to save analysis history and access your dashboard.
                </p>
              </div>

              <ArrowRight className="hidden lg:block w-10 h-10 text-primary/70" />

              {/* STEP 3 */}
              <div className="flex flex-col items-center max-w-xs">
                <span className="text-primary text-xs font-semibold tracking-wider mb-2">
                  STEP 3
                </span>
                <h3 className="font-semibold mb-2">Open Product Page</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Visit any Amazon product and scroll to the reviews section.
                </p>
              </div>

              <ArrowRight className="hidden lg:block w-10 h-10 text-primary/70" />

              {/* STEP 4 */}
              <div className="flex flex-col items-center max-w-xs">
                <span className="text-primary text-xs font-semibold tracking-wider mb-2">
                  STEP 4
                </span>
                <h3 className="font-semibold mb-2">Analyze Reviews</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Click analyze to get AI-powered sentiment insights in seconds.
                </p>
              </div>

              <ArrowRight className="hidden lg:block w-10 h-10 text-primary/70" />

              {/* STEP 5 */}
              <div className="flex flex-col items-center max-w-xs">
                <span className="text-primary text-xs font-semibold tracking-wider mb-2">
                  STEP 5
                </span>
                <h3 className="font-semibold mb-2">View Dashboard Insights</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Explore sentiment breakdowns, key aspects, and saved products.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 sm:mt-16 lg:mt-20">
              <a
                href={EXTENSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="xl">
                  Download Chrome Extension
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="border-t py-6 sm:py-8"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 SentiView. Analyze smarter, decide better.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
