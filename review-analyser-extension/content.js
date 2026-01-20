console.log("✅ CONTENT SCRIPT LOADED");

function detectPlatform() {
  if (location.hostname.includes("amazon")) return "amazon";
  if (location.hostname.includes("flipkart")) return "flipkart";
  return "unknown";
}

function extractAmazonProductName() {
  return (
    document.querySelector("#productTitle")?.innerText.trim() ||
    document
      .querySelector(".a-link-normal[data-hook='product-link']")
      ?.innerText.trim() ||
    document.title.replace("Amazon.in:Customer reviews:", "").trim() ||
    null
  );
}

function extractProductName(platform) {
  if (platform === "amazon") {
    return extractAmazonProductName();
  }

  if (platform === "flipkart") {
    return (
      document.querySelector("span.B_NuCI")?.innerText.trim() ||
      document.title.split(" Reviews")[0] ||
      null
    );
  }

  return null;
}

function getAmazonASIN() {
  // Try DOM first
  const domAsin =
    document.querySelector("#ASIN")?.value ||
    document.querySelector("[data-asin]")?.getAttribute("data-asin");

  if (domAsin) return domAsin;

  // Fallback: extract from URL
  const match = window.location.pathname.match(
    /product-reviews\/([A-Z0-9]{10})/
  );
  return match ? match[1] : null;
}

async function fetchAllAmazonReviews(asin, pages = 5) {
  const allReviews = [];

  for (let i = 1; i <= pages; i++) {
    const res = await fetch(
      `https://www.amazon.in/product-reviews/${asin}?pageNumber=${i}`,
      { credentials: "include" }
    );

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    doc.querySelectorAll('[data-hook="review"]').forEach((block) => {
      const text = block.querySelector('[data-hook="review-body"]')?.innerText;
      const rating = block
        .querySelector('[data-hook="review-star-rating"] span')
        ?.innerText.match(/(\d)/)?.[1];

      if (text && rating) {
        allReviews.push({
          text: text.trim(),
          rating: Number(rating),
        });
      }
    });
  }

  return {
    reviews: allReviews, // ❗ no slicing here
  };
}

// function extractAmazonReviews() {
//   const reviewBlocks = document.querySelectorAll('[data-hook="review"]');
//   const reviews = [];

//   reviewBlocks.forEach(block => {
//     const textEl = block.querySelector('[data-hook="review-body"]');
//     const ratingEl = block.querySelector('[data-hook="review-star-rating"] span');

//     if (!textEl || !ratingEl) return;

//     const text = textEl.innerText.replace(/\s+/g, " ").trim();
//     const ratingMatch = ratingEl.innerText.match(/(\d)/);

//     if (!text || !ratingMatch) return;

//     reviews.push({
//       text,
//       rating: Number(ratingMatch[1])
//     });
//   });

//   return reviews;
// }

function extractFlipkartReviews() {
  const reviewBlocks = document.querySelectorAll("div._27M-vq");
  const reviews = [];

  reviewBlocks.forEach((block) => {
    const textEl = block.querySelector("div.t-ZTKy");
    const ratingEl = block.querySelector("div._3LWZlK");

    if (!textEl || !ratingEl) return;

    const text = textEl.innerText.replace("READ MORE", "").trim();
    const rating = Number(ratingEl.innerText);

    if (!text || isNaN(rating)) return;

    reviews.push({
      text,
      rating,
    });
  });

  return reviews;
}

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action !== "EXTRACT_REVIEWS") return;

//   const platform = detectPlatform();
//   let reviews = [];

//   if (platform === "amazon") {
//     // reviews = extractAmazonReviews();
//     reviews = fetchAllAmazonReviews(getAmazonASIN());
//   } else if (platform === "flipkart") {
//     reviews = extractFlipkartReviews();
//   } else {
//     sendResponse({ error: "Unsupported platform" });
//     return;
//   }

//   const productName = extractProductName(platform);
//   const productUrl = window.location.href;

//   sendResponse({
//     platform,
//     product: {
//       name: productName,
//       url: productUrl
//     },
//     reviews
//   });
// });
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== "EXTRACT_REVIEWS") return;

  (async () => {
    const platform = detectPlatform();
    let reviews = [];
    let totalReviews = null;

    if (platform === "amazon") {
      const asin = getAmazonASIN();
      if (!asin) {
        sendResponse({ error: "ASIN not found" });
        return;
      }
      const pages = msg.pages || 5;
      const result = await fetchAllAmazonReviews(asin, pages);
      reviews = result.reviews;
      totalReviews = result.totalReviews;
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
        url: productUrl,
      },
      reviews,
    });
  })();

  // 🔥 REQUIRED for async response
  return true;
});

// 🔐 Listen for Firebase token from frontend
window.addEventListener("message", (event) => {
  // Only accept messages from same page
  if (event.source !== window) return;

  // Only handle our specific message
  if (event.data?.type === "SET_FIREBASE_TOKEN") {
    const token = event.data.token;

    if (!token) return;

    // ✅ Store token in Chrome extension storage
    chrome.storage.local.set({ firebaseToken: token }, () => {
      console.log("✅ Firebase token stored in extension");
    });
  }
});
