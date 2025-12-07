import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export function ReviewCard({ review }) {
  const getSentimentIcon = () => {
    switch (review.sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentStyles = () => {
    switch (review.sentiment) {
      case 'positive':
        return 'border-sentiment-positive/30 bg-sentiment-positive/5';
      case 'negative':
        return 'border-sentiment-negative/30 bg-sentiment-negative/5';
      default:
        return 'border-sentiment-neutral/30 bg-sentiment-neutral/5';
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all duration-200 hover:scale-[1.01]",
        getSentimentStyles()
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm leading-relaxed">{review.text}</p>
        <div
          className={cn(
            "flex-shrink-0 p-1.5 rounded-full",
            `sentiment-${review.sentiment}`,
            review.sentiment === 'positive' && 'bg-sentiment-positive/20',
            review.sentiment === 'negative' && 'bg-sentiment-negative/20',
            review.sentiment === 'neutral' && 'bg-sentiment-neutral/20'
          )}
        >
          {getSentimentIcon()}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {review.keywords.slice(0, 3).map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.round(review.confidence * 100)}% confidence
        </span>
      </div>
    </div>
  );
}
