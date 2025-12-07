import { cn } from '@/lib/utils';
import { Clock, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function HistoryList({ history, onSelect }) {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-sentiment-positive" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-sentiment-negative" />;
      default:
        return <Minus className="h-4 w-4 text-sentiment-neutral" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-sentiment-positive';
    if (score >= 40) return 'text-sentiment-neutral';
    return 'text-sentiment-negative';
  };

  if (history.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No analysis history</h3>
        <p className="text-sm text-muted-foreground">
          Your analyzed products will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full glass-card p-4 hover:border-primary/30 transition-all duration-200 group text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getSentimentIcon(item.overallSentiment)}
              <div>
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {item.productName}
                </h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(item.analyzedAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('text-2xl font-bold', getScoreColor(item.sentimentScore))}>
                {item.sentimentScore}
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}