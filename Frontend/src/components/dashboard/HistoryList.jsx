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

import { cn } from "@/lib/utils";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function HistoryList({ history, onSelect, onDelete }) {
  // Returns icon based on sentiment string
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-sentiment-positive" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-sentiment-negative" />;
      default:
        return <Minus className="h-4 w-4 text-sentiment-neutral" />;
    }
  };

  // Maps sentiment score (0–100) to color classes
  const getScoreColor = (score) => {
    if (score >= 70) return "text-sentiment-positive";
    if (score >= 40) return "text-sentiment-neutral";
    return "text-sentiment-negative";
  };

  const getOverallSentiment = (counts = {}) => {
    const { positive = 0, neutral = 0, negative = 0 } = counts;

    if (positive >= negative && positive >= neutral) return "positive";
    if (negative >= positive && negative >= neutral) return "negative";
    return "neutral";
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
       
        // 🔹 Extract safe values with defaults
        const sentiment = getOverallSentiment(item.summaryCounts);
        const productName = item.product?.name || "Analysis";
        const total =
          (item.summaryCounts?.positive || 0) +
          (item.summaryCounts?.neutral || 0) +
          (item.summaryCounts?.negative || 0) ||
          1;

        const score = Math.round(
          ((item.summaryCounts?.positive || 0) / total) * 100
        );

        return (
          <button
            key={item._id} // MongoDB uses _id, not id
            onClick={() => onSelect(item._id)}
            className="w-full glass-card p-4 hover:border-primary/30 transition-all duration-200 group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 🔄 MODIFIED: sentiment icon now uses derived sentiment */}
                {getSentimentIcon(sentiment)}

                <div>
                  {/* Product name comes from analysis result */}
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {productName}
                  </h4>

                  {/* Use MongoDB createdAt timestamp */}
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* score derived from counts */}
                <span
                  className={cn("text-2xl font-bold", getScoreColor(score))}
                >
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
