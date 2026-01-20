import { BACKEND_BASE_URL } from "./config.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeMoreBtn = document.getElementById("analyzeMoreBtn");
const output = document.getElementById("output");

let currentPages = 5; // default = 50 reviews
let lastSentCount = 0;
let analysisSessionId = null;

async function analyze(pages) {
  output.textContent = "Analyzing reviews, please wait...";
  analyzeMoreBtn.hidden = true;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    { action: "EXTRACT_REVIEWS", pages },
    async (data) => {
      if (chrome.runtime.lastError || !data || data.error) {
        output.textContent = "Please refresh the product page and try again.";
        return;
      }

      try {
        // 🔑 RESTORED AUTH FLOW (THIS FIXES HISTORY)
        chrome.storage.local.get(
          ["firebaseToken"],
          async ({ firebaseToken }) => {
            const headers = {
              "Content-Type": "application/json",
            };

            if (firebaseToken) {
              headers.Authorization = `Bearer ${firebaseToken}`;
            }

            const newReviews = data.reviews.slice(lastSentCount);
            lastSentCount = data.reviews.length;

            if (newReviews.length === 0) {
              output.textContent = "No more reviews found. Try again later.";
              analyzeMoreBtn.hidden = true;
              return;
            }

            const res = await fetch(`${BACKEND_BASE_URL}/api/analyze`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                platform: data.platform,
                product: data.product,
                reviews: newReviews,
                sessionId: analysisSessionId
              }),
            });

            const result = await res.json();

            const analyzed = data.reviews.length;

            output.textContent = `
Product: ${data.product?.name || "Unknown"}

Analysis completed for ${analyzed} reviews.

You may refer to the Sentiment Analysis History
for detailed insights.
          `.trim();
            analyzeMoreBtn.hidden = false;
          }
        );
      } catch (err) {
        console.error(err);
        output.textContent = "Unable to connect to the analysis service.";
      }
    }
  );
}

// Initial analysis
analyzeBtn.addEventListener("click", () => {
  currentPages = 5;
  lastSentCount = 0;
  analysisSessionId = crypto.randomUUID(); // 🔑 NEW SESSION
  analyze(currentPages);
});

// Analyze more reviews
analyzeMoreBtn.addEventListener("click", () => {
  currentPages += 5; // increase safely
  analyze(currentPages);
});
