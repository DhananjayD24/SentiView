import { BACKEND_BASE_URL } from "./config.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeMoreBtn = document.getElementById("analyzeMoreBtn");
const output = document.getElementById("output");

let pagesToAnalyze = 1;
let analysisSessionId = null;
let totalAnalyzedReviews = 0;

/* ================= DEDUPE ================= */

const sentReviewKeys = new Set();

function reviewKey(review) {
  return `${review.rating}|${review.text.trim().toLowerCase()}`;
}

/* ================= ANALYZE ================= */

async function analyze(pages) {
  output.textContent = "Analyzing reviews, please wait...";
  analyzeMoreBtn.hidden = true;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    { action: "EXTRACT_REVIEWS", pages },
    async (data) => {
      if (chrome.runtime.lastError || !data || data.error) {
        output.textContent = "Please refresh the page and try again.";
        return;
      }

      chrome.storage.local.get(["firebaseToken"], async ({ firebaseToken }) => {
        const headers = { "Content-Type": "application/json" };
        if (firebaseToken) headers.Authorization = `Bearer ${firebaseToken}`;

        if (!data.reviews || data.reviews.length === 0) {
          output.textContent = "No reviews found.";
          analyzeMoreBtn.hidden = true;
          return;
        }

        // ✅ ONLY NEW REVIEWS
        const newReviews = data.reviews.filter((r) => {
          const key = reviewKey(r);
          if (sentReviewKeys.has(key)) return false;
          sentReviewKeys.add(key);
          return true;
        });
        totalAnalyzedReviews += newReviews.length;

        if (newReviews.length === 0) {
          output.textContent = "No new reviews found on this page.";
          analyzeMoreBtn.hidden = data.hasMorePages === false;
          return;
        }

        // 🔍 LOG ONLY NEW REVIEWS
        console.log("🆕 NEW reviews being sent:");
        console.log(
          newReviews.map((r, i) => ({
            index: i + 1,
            rating: r.rating,
            preview: r.text.slice(0, 60),
          }))
        );

        await fetch(`${BACKEND_BASE_URL}/api/analyze`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            platform: data.platform,
            product: data.product,
            reviews: newReviews,
            sessionId: analysisSessionId,
          }),
        });

        output.textContent = `
Product: ${data.product?.name || "Unknown"}

Analysis completed for ${newReviews.length} new reviews from this page.
(Total analysed reviews: ${totalAnalyzedReviews})
        `.trim();

        if (data.hasMorePages === false) {
          output.textContent +=
            "\n\n🚫 No more reviews available for this product.";
          analyzeMoreBtn.hidden = true;
          return;
        }

        analyzeMoreBtn.hidden = false;
      });
    }
  );
}

/* ================= BUTTONS ================= */

// First analyze
analyzeBtn.addEventListener("click", () => {
  pagesToAnalyze = 1;
  analysisSessionId = crypto.randomUUID();
  sentReviewKeys.clear(); // reset dedupe
  analyze(pagesToAnalyze);
});

// Analyze more
analyzeMoreBtn.addEventListener("click", () => {
  pagesToAnalyze += 1;
  analyze(pagesToAnalyze);
});
