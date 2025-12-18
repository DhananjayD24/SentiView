// import { cn } from '@/lib/utils';
// import { Clock, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// export function HistoryList({ history, onSelect }) {
//   const getSentimentIcon = (sentiment) => {
//     switch (sentiment) {
//       case 'positive':
//         return <TrendingUp className="h-4 w-4 text-sentiment-positive" />;
//       case 'negative':
//         return <TrendingDown className="h-4 w-4 text-sentiment-negative" />;
//       default:
//         return <Minus className="h-4 w-4 text-sentiment-neutral" />;
//     }
//   };

//   const getScoreColor = (score) => {
//     if (score >= 70) return 'text-sentiment-positive';
//     if (score >= 40) return 'text-sentiment-neutral';
//     return 'text-sentiment-negative';
//   };

//   if (history.length === 0) {
//     return (
//       <div className="glass-card p-8 text-center">
//         <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-lg font-medium mb-2">No analysis history</h3>
//         <p className="text-sm text-muted-foreground">
//           Your analyzed products will appear here
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {history.map((item) => (
//         <button
//           key={item.id}
//           onClick={() => onSelect(item.id)}
//           className="w-full glass-card p-4 hover:border-primary/30 transition-all duration-200 group text-left"
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               {getSentimentIcon(item.overallSentiment)}
//               <div>
//                 <h4 className="font-medium group-hover:text-primary transition-colors">
//                   {item.productName}
//                 </h4>
//                 <p className="text-sm text-muted-foreground flex items-center gap-1">
//                   <Clock className="h-3 w-3" />
//                   {formatDistanceToNow(item.analyzedAt, { addSuffix: true })}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className={cn('text-2xl font-bold', getScoreColor(item.sentimentScore))}>
//                 {item.sentimentScore}
//               </span>
//               <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
//             </div>
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// }

import { cn } from '@/lib/utils';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function HistoryList({ history, onSelect, onDelete }) {

  // Returns icon based on sentiment string
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

  // Maps sentiment score (0–100) to color classes
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-sentiment-positive';
    if (score >= 40) return 'text-sentiment-neutral';
    return 'text-sentiment-negative';
  };

  // Empty state when no history exists
  if (!history || history.length === 0) {
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
      {history.map((item) => {

        // 🔒 SAFETY: result may be missing in old records
        const result = item.result || {};

        // 🔹 Extract safe values with defaults
        const sentiment = result.overallSentiment || 'neutral';
        const score = Math.round((result.sentimentScore || 0) * 100);
        const productName = result.productName || 'Analysis';

        return (
          <button
            key={item._id}               // MongoDB uses _id, not id
            onClick={() => onSelect(item._id)}
            className="w-full glass-card p-4 hover:border-primary/30 transition-all duration-200 group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">

                {/* ✅ FIXED:
                    Was: item.result?.item.overallSentiment ❌
                    Now: safe sentiment value */}
                {getSentimentIcon(sentiment)}

                <div>
                  {/* Product name comes from analysis result */}
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {productName}
                  </h4>

                  {/* Use MongoDB createdAt timestamp */}
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(
                      new Date(item.createdAt),
                      { addSuffix: true }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Score converted from 0–1 → 0–100 */}
                <span className={cn('text-2xl font-bold', getScoreColor(score))}>
                  {score}
                </span>

                <button
  onClick={(e) => {
    e.stopPropagation(); // 🚨 prevents opening details
    onDelete(item._id);
  }}
  className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
>
  Delete
</button>

                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
