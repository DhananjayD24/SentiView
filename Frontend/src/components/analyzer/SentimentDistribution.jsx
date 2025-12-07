export function SentimentDistribution({
  positive,
  negative,
  neutral,
  total,
}) {
  const positivePercent = Math.round((positive / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);
  const neutralPercent = Math.round((neutral / total) * 100);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Sentiment Distribution</h3>
      
      <div className="h-3 rounded-full bg-muted overflow-hidden flex">
        <div
          className="bg-sentiment-positive transition-all duration-700"
          style={{ width: `${positivePercent}%` }}
        />
        <div
          className="bg-sentiment-neutral transition-all duration-700"
          style={{ width: `${neutralPercent}%` }}
        />
        <div
          className="bg-sentiment-negative transition-all duration-700"
          style={{ width: `${negativePercent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-sentiment-positive" />
            <span className="text-sm text-muted-foreground">Positive</span>
          </div>
          <p className="text-xl font-bold sentiment-positive">{positive}</p>
          <p className="text-xs text-muted-foreground">{positivePercent}%</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-sentiment-neutral" />
            <span className="text-sm text-muted-foreground">Neutral</span>
          </div>
          <p className="text-xl font-bold sentiment-neutral">{neutral}</p>
          <p className="text-xs text-muted-foreground">{neutralPercent}%</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-sentiment-negative" />
            <span className="text-sm text-muted-foreground">Negative</span>
          </div>
          <p className="text-xl font-bold sentiment-negative">{negative}</p>
          <p className="text-xs text-muted-foreground">{negativePercent}%</p>
        </div>
      </div>
    </div>
  );
}
