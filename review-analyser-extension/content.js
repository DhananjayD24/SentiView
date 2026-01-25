console.log("✅ CONTENT SCRIPT LOADED");

/* ================= PLATFORM ================= */

function detectPlatform() {
  if (location.hostname.includes("amazon")) return "amazon";
  return "unknown";
}

/* ================= PRODUCT INFO ================= */

function extractAmazonProductName() {
  return (
    document.querySelector("#productTitle")?.innerText.trim() ||
    document.title.replace("Amazon.in:Customer reviews:", "").trim() ||
    null
  );
}

function getAmazonASIN() {
  const domAsin =
    document.querySelector("#ASIN")?.value ||
    document.querySelector("[data-asin]")?.getAttribute("data-asin");

  if (domAsin) return domAsin;

  const match = location.pathname.match(/product-reviews\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

/* ================= REVIEW FETCH ================= */
let lastPageSignature = null;

async function fetchAmazonReviewsRange(asin, startPage, endPage) {
  const reviews = [];
  const seen = new Set();

  for (let page = startPage; page <= endPage; page++) {
    console.log(`📄 Fetching Amazon review page: ${page}`);
    
    const res = await fetch(
      `https://www.amazon.in/product-reviews/${asin}?pageNumber=${page}&reviewerType=all_reviews&sortBy=recent`,
      { credentials: "include" }
    );

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    /* 🔑 DUPLICATE PAGE DETECTION (CRITICAL FIX) */
    const pageSignature = doc.body.innerText.slice(0, 500);
    if (pageSignature === lastPageSignature) {
      console.warn(`⚠️ Amazon returned duplicate page at ${page}, stopping.`);
      break;
    }
    lastPageSignature = pageSignature;

    const blocks = doc.querySelectorAll('[data-hook="review"]');

    // 🛑 Stop if Amazon stops giving reviews
    if (blocks.length === 0) {
      console.warn(`⚠️ No reviews found on page ${page}, stopping.`);
      break;
    }

    blocks.forEach((block) => {
      const text = block.querySelector('[data-hook="review-body"]')?.innerText;
      const rating = block
        .querySelector('[data-hook="review-star-rating"] span')
        ?.innerText.match(/(\d)/)?.[1];

      if (!text || !rating) return;

      // 🚫 Filter fake media placeholder reviews
      if (text.includes("The media could not be loaded")) return;

      const key = text.trim().toLowerCase();
      if (seen.has(key)) return;

      seen.add(key);
      reviews.push({
        text: text.trim(),
        rating: Number(rating),
      });
    });
  }

  console.log("✅ Reviews collected:", reviews.length);
  return reviews;
}

/* ================= MESSAGE HANDLER ================= */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== "EXTRACT_REVIEWS") return;

  (async () => {
    const platform = detectPlatform();
    if (platform !== "amazon") {
      sendResponse({ error: "Unsupported platform" });
      return;
    }

    const asin = getAmazonASIN();
    if (!asin) {
      sendResponse({ error: "ASIN not found" });
      return;
    }

    const { startPage, endPage } = msg;
    if (!startPage || !endPage) {
      sendResponse({ error: "Page range missing" });
      return;
    }

    const reviews = await fetchAmazonReviewsRange(
      asin,
      startPage,
      endPage
    );

    sendResponse({
      platform: "amazon",
      product: {
        name: extractAmazonProductName(),
        url: location.href,
      },
      reviews,
    });
  })();

  return true; // async response
});

/* ================= FIREBASE TOKEN ================= */

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== "SET_FIREBASE_TOKEN") return;

  chrome.storage.local.set({ firebaseToken: event.data.token }, () => {
    console.log("✅ Firebase token stored in extension");
  });
});
