import { BACKEND_BASE_URL } from "./config.js";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.textContent = "Analyzing reviews...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_REVIEWS" }, async (data) => {
    if (!data || data.error) {
      output.textContent = data?.error || "No response from page";
      return;
    }

    try {
      chrome.storage.local.get(["firebaseToken"], async ({ firebaseToken }) => {
        const headers = {
          "Content-Type": "application/json"
        };

        // optional auth
        if (firebaseToken) {
          headers.Authorization = `Bearer ${firebaseToken}`;
        }

        const res = await fetch(`${BACKEND_BASE_URL}/api/analyze`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            platform: data.platform,
            product: data.product,
            reviews: data.reviews
          })
        });

        const result = await res.json();
        output.textContent = JSON.stringify(result, null, 2);
      });
    } catch (err) {
      output.textContent = "❌ Failed to connect to backend";
      console.error(err);
    }
  });
});
