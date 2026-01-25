console.log("✅ CONTENT SCRIPT LOADED");

/* ================= UTIL ================= */

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/* ================= PLATFORM ================= */

function detectPlatform() {
  return location.hostname.includes("amazon") ? "amazon" : "unknown";
}

/* ================= PRODUCT INFO ================= */

function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function extractAmazonProductName() {
  const rawTitle =
    document.querySelector("#productTitle")?.innerText ||
    document.title.replace("Amazon.in:Customer reviews:", "").trim() ||
    null;

  return rawTitle ? decodeHTMLEntities(rawTitle).trim() : null;
}

/* ================= REVIEW EXTRACTION ================= */

function extractReviewsFromCurrentPage() {
  const reviews = [];
  const blocks = document.querySelectorAll('[data-hook="review"]');

  blocks.forEach((block) => {
    const text = block.querySelector('[data-hook="review-body"]')?.innerText;
    const rating = block
      .querySelector('[data-hook="review-star-rating"] span')
      ?.innerText.match(/(\d)/)?.[1];

    if (!text || !rating) return;
    if (text.includes("The media could not be loaded")) return;

    reviews.push({
      text: text.trim(),
      rating: Number(rating),
    });
  });

  return reviews;
}

function clickNextPage() {
  const nextBtn = document.querySelector("li.a-last a");
  if (!nextBtn) return false;
  nextBtn.click();
  return true;
}

/* ================= MAIN COLLECTOR ================= */

async function collectAmazonReviews(pagesToCollect = 1) {
  const allReviews = [];
  const seen = new Set();

  for (let i = 0; i < pagesToCollect; i++) {
    console.log(`📄 Reading Amazon review page ${i + 1}`);

    const pageReviews = extractReviewsFromCurrentPage();

    pageReviews.forEach((r) => {
      const key = `${r.rating}|${r.text.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        allReviews.push(r);
      }
    });

    console.log(`✅ Total collected so far: ${allReviews.length}`);

    if (i === pagesToCollect - 1) {
      return { reviews: allReviews, hasMorePages: true };
    }

    const moved = clickNextPage();
    if (!moved) {
      console.warn("❌ No next page button found. Stopping.");
      return { reviews: allReviews, hasMorePages: false };
    }

    await sleep(3500); // wait for Amazon navigation
  }

  return { reviews: allReviews, hasMorePages: false };
}

/* ================= MESSAGE HANDLER ================= */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== "EXTRACT_REVIEWS") return;

  (async () => {
    if (detectPlatform() !== "amazon") {
      sendResponse({ error: "Unsupported platform" });
      return;
    }

    const pages = msg.pages ?? 1;
    const result = await collectAmazonReviews(pages);

    console.log("📦 Sending reviews to popup:", result.reviews.length);

    sendResponse({
      platform: "amazon",
      product: {
        name: extractAmazonProductName(),
        url: location.href,
      },
      reviews: result.reviews,
      hasMorePages: result.hasMorePages,
    });
  })();

  return true;
});

/* ================= FIREBASE TOKEN ================= */

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== "SET_FIREBASE_TOKEN") return;

  chrome.storage.local.set({ firebaseToken: event.data.token }, () => {
    console.log("✅ Firebase token stored in extension");
  });
});
