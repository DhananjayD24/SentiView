import { BACKEND_BASE_URL } from "./config.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeMoreBtn = document.getElementById("analyzeMoreBtn");
const output = document.getElementById("output");

let currentPage = 1;
let analysisSessionId = null;

async function analyze(page) {
  output.textContent = "Analyzing reviews, please wait...";
  analyzeMoreBtn.hidden = true;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    { action: "EXTRACT_REVIEWS", startPage: page, endPage: page },
    async (data) => {
      if (chrome.runtime.lastError || !data || data.error) {
        output.textContent = "Please refresh the product page and try again.";
        return;
      }

      try {
        chrome.storage.local.get(
          ["firebaseToken"],
          async ({ firebaseToken }) => {
            const headers = {
              "Content-Type": "application/json",
            };

            if (firebaseToken) {
              headers.Authorization = `Bearer ${firebaseToken}`;
            }

            if (!data.reviews || data.reviews.length === 0) {
              output.textContent = "No more reviews found.";
              analyzeMoreBtn.hidden = true;
              return;
            }

            // 🔍 DEBUG LOG (keep for now)
            console.log("📦 Reviews fetched from content script:");
            console.log("Count:", data.reviews.length);
            console.log(
              data.reviews.map((r, i) => ({
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
                reviews: data.reviews,
                sessionId: analysisSessionId,
              }),
            });

            output.textContent = `
Product: ${data.product?.name || "Unknown"}

Analysis completed for ${data.reviews.length} new reviews.

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

/* ================= BUTTONS ================= */

// First analyze → page 1
analyzeBtn.addEventListener("click", () => {
  currentPage = 1;
  analysisSessionId = crypto.randomUUID(); // new session
  analyze(currentPage);
});

// Analyze more → next page
analyzeMoreBtn.addEventListener("click", () => {
  currentPage += 1;
  analyze(currentPage);
});
