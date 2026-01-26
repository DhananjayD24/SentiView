import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  MousePointerClick,
  Zap,
} from "lucide-react";

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] lg:w-[800px] h-[450px] sm:h-[520px] lg:h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm text-primary mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Instant Sentiment Analysis
          </div>

          <h1 className="mb-6 leading-tight animate-slide-up">
            <span className="block text-yellow-100 text-xl sm:text-2xl md:text-3xl lg:text-2xl font-medium">
              Understand Customer
            </span>

            <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 bg-clip-text text-transparent">
              Reviews at a Glance
            </span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Analyze product reviews from amazon e-commerce platform. Get
            actionable insights to make informed purchasing decisions or improve
            your products.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {!isAuthenticated && (
              <Link to="/signup">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>

          {/* Features */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="glass-card p-5 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Deep Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Extract sentiment, keywords, and trends from hundreds of reviews
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get comprehensive insights in seconds with our AI engine
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <MousePointerClick className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Analyze product reviews with a simple, intuitive workflow — no
                learning curve required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
