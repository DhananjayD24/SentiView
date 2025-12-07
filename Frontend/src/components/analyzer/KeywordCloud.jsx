import { cn } from '@/lib/utils';

export function KeywordCloud({ title, keywords, type }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105",
              type === 'positive'
                ? "bg-sentiment-positive/15 text-sentiment-positive border border-sentiment-positive/20"
                : "bg-sentiment-negative/15 text-sentiment-negative border border-sentiment-negative/20"
            )}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}