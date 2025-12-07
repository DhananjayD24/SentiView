import { SentimentGauge } from './SentimentGauge';
import { SentimentDistribution } from './SentimentDistribution';
import { KeywordCloud } from './KeywordCloud';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Download, ExternalLink } from 'lucide-react';

export function AnalysisResults({ result, onSave }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">{result.productName}</h2>
            {result.productLink && (
              <a
                href={result.productLink}
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <SentimentGauge score={result.sentimentScore} sentiment={result.overallSentiment} />
          </div>
          <SentimentDistribution
            positive={result.positiveCount}
            negative={result.negativeCount}
            neutral={result.neutralCount}
            total={result.totalReviews}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KeywordCloud
            title="What customers love"
            keywords={result.topPositiveKeywords}
            type="positive"
          />
          <KeywordCloud
            title="What needs improvement"
            keywords={result.topNegativeKeywords}
            type="negative"
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">
          Analyzed Reviews ({result.totalReviews})
        </h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {result.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}