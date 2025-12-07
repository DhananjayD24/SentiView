import { cn } from '@/lib/utils';
import { Star, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export function SavedProductCard({ product, onReanalyze, onRemove }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-sentiment-positive';
    if (score >= 40) return 'text-sentiment-neutral';
    return 'text-sentiment-negative';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-sentiment-positive/10 border-sentiment-positive/20';
    if (score >= 40) return 'bg-sentiment-neutral/10 border-sentiment-neutral/20';
    return 'bg-sentiment-negative/10 border-sentiment-negative/20';
  };

  return (
    <div className="glass-card p-5 group hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Star className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium group-hover:text-primary transition-colors">
              {product.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              Last analyzed {formatDistanceToNow(product.lastAnalyzed, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div
          className={cn(
            'px-3 py-1.5 rounded-lg border text-xl font-bold',
            getScoreBg(product.sentimentScore),
            getScoreColor(product.sentimentScore)
          )}
        >
          {product.sentimentScore}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {product.link ? (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Product <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">No link available</span>
        )}

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReanalyze(product.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(product.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
