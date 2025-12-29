console.log("✅ CONTENT SCRIPT LOADED");

function detectPlatform() {
  if (location.hostname.includes("amazon")) return "amazon";
  if (location.hostname.includes("flipkart")) return "flipkart";
  return "unknown";
}

function extractProductName(platform) {
  if (platform === "amazon") {
    return document.querySelector("#productTitle")?.innerText.trim() || null;
  }

  if (platform === "flipkart") {
    return document.querySelector("span.B_NuCI")?.innerText.trim() || null;
  }

  return null;
}

function extractAmazonReviews() {
  const reviewBlocks = document.querySelectorAll('[data-hook="review"]');
  const reviews = [];

  reviewBlocks.forEach(block => {
    const textEl = block.querySelector('[data-hook="review-body"]');
    const ratingEl = block.querySelector('[data-hook="review-star-rating"] span');

    if (!textEl || !ratingEl) return;

    const text = textEl.innerText.replace(/\s+/g, " ").trim();
    const ratingMatch = ratingEl.innerText.match(/(\d)/);

    if (!text || !ratingMatch) return;

    reviews.push({
      text,
      rating: Number(ratingMatch[1])
    });
  });

  return reviews;
}

function extractFlipkartReviews() {
  const reviewBlocks = document.querySelectorAll("div._27M-vq");
  const reviews = [];

  reviewBlocks.forEach(block => {
    const textEl = block.querySelector("div.t-ZTKy");
    const ratingEl = block.querySelector("div._3LWZlK");

    if (!textEl || !ratingEl) return;

    const text = textEl.innerText.replace("READ MORE", "").trim();
    const rating = Number(ratingEl.innerText);

    if (!text || isNaN(rating)) return;

    reviews.push({
      text,
      rating
    });
  });

  return reviews;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== "EXTRACT_REVIEWS") return;

  const platform = detectPlatform();
  let reviews = [];

  if (platform === "amazon") {
    reviews = extractAmazonReviews();
  } else if (platform === "flipkart") {
    reviews = extractFlipkartReviews();
  } else {
    sendResponse({ error: "Unsupported platform" });
    return;
  }

  const productName = extractProductName(platform);
  const productUrl = window.location.href;

  sendResponse({
    platform,
    product: {
      name: productName,
      url: productUrl
    },
    reviews
  });
});
