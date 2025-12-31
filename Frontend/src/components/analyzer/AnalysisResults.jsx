import { SentimentGauge } from "./SentimentGauge";
import { SentimentDistribution } from "./SentimentDistribution";
import { KeywordCloud } from "./KeywordCloud";
import { ReviewCard } from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Download, ExternalLink } from "lucide-react";

export function AnalysisResults({ result, onSave }) {
  const { isAuthenticated } = useAuth();
  if (!result) return null;

  const { positive, neutral, negative } = result.summaryCounts || {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  const total = positive + neutral + negative || 1;

  const sentimentScore = Math.round((positive / total) * 100);

  const overallSentiment =
    positive >= negative && positive >= neutral
      ? "positive"
      : negative >= positive && negative >= neutral
      ? "negative"
      : "neutral";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {result.product?.name || "Product Analysis"}
            </h2>
            {result.product?.url && (
              <a
                href={result.product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View Product <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={onSave}>
                <Star className="h-4 w-4" />
                Save Product
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <SentimentGauge
              score={sentimentScore}
              sentiment={overallSentiment}
            />
          </div>
          <SentimentDistribution
            positive={positive}
            negative={negative}
            neutral={neutral}
            total={total}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KeywordCloud
            title="What customers love"
            keywords={(result.insights?.reasonsToBuy || []).map((word) => ({
              word,
              count: null, // optional
            }))}
            type="positive"
          />
          <KeywordCloud
            title="What needs improvement"
            keywords={(result.insights?.reasonsToAvoid || []).map((word) => ({
              word,
              count: null,
            }))}
            type="negative"
          />
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs text-muted-foreground leading-tight">
          Analysis based on{" "}
          <span className="font-medium text-foreground">
            {result.summaryCounts?.total || 0}
          </span>{" "}
          customer reviews.
        </p>
      </div>
    </div>
  );
}
