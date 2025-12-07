import { cn } from '@/lib/utils';

export function SentimentGauge({ score, sentiment, size = 'lg' }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'stroke-sentiment-positive';
      case 'negative':
        return 'stroke-sentiment-negative';
      case 'neutral':
        return 'stroke-sentiment-neutral';
      case 'mixed':
        return 'stroke-sentiment-mixed';
      default:
        return 'stroke-primary';
    }
  };

  const getSentimentLabel = () => {
    switch (sentiment) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      case 'neutral':
        return 'Neutral';
      case 'mixed':
        return 'Mixed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative', sizeClasses[size])}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn('transition-all duration-1000 ease-out', getSentimentColor())}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', textSizeClasses[size])}>{score}</span>
        </div>
      </div>
      <span
        className={cn(
          'text-sm font-medium capitalize',
          `sentiment-${sentiment}`
        )}
      >
        {getSentimentLabel()}
      </span>
    </div>
  );
}
