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
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platform: data.platform,
          product: data.product,
          reviews: data.reviews
        })
      });

      const mlResult = await res.json();

      output.textContent = JSON.stringify(mlResult, null, 2);
    } catch (err) {
      output.textContent = "❌ Failed to connect to ML service";
      console.error(err);
    }
  });
});
