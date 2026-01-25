// import fetch from "node-fetch";
// import Analysis from "../models/Analysis.js";
// import crypto from "crypto";

// function mergeCounts(oldObj = {}, newObj = {}) {
//   const merged = { ...oldObj };
//   for (const key in newObj) {
//     merged[key] = (merged[key] || 0) + newObj[key];
//   }
//   return merged;
// }

// function mergeAspectSummary(oldAspects = {}, newAspects = {}) {
//   const merged = { ...oldAspects };

//   for (const aspect in newAspects) {
//     if (!merged[aspect]) {
//       merged[aspect] = { ...newAspects[aspect] };
//     } else {
//       for (const sentiment in newAspects[aspect]) {
//         merged[aspect][sentiment] =
//           (merged[aspect][sentiment] || 0) + newAspects[aspect][sentiment];
//       }
//     }
//   }

//   return merged;
// }

// function hashReview(review) {
//   return crypto
//     .createHash("sha256")
//     .update(review.text.trim().toLowerCase())
//     .digest("hex");
// }

// export const analyze = async (req, res) => {
//   try {
//     const { platform, product, reviews, sessionId } = req.body;

//     if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
//       return res.status(400).json({ error: "Reviews array is required" });
//     }
//     console.log("PRODUCT RECEIVED:", product);

//     let savedDoc = null;
//     let processedReviews = [];

//     if (req.user) {
//       savedDoc = await Analysis.findOne({
//         userId: req.user.uid,
//         sessionId,
//       });

//       if (savedDoc) {
//         processedReviews = savedDoc.processedReviews || [];
//       }
//     }

//     // 🧹 FILTER ONLY NEW REVIEWS (CRITICAL FIX)
//     const newReviews = reviews.filter((review) => {
//       const hash = hashReview(review);
//       return !processedReviews.includes(hash);
//     });

//     // 🚫 IF NOTHING NEW, RETURN EXISTING ANALYSIS
//     if (newReviews.length === 0 && savedDoc) {
//       return res.json({
//         saved: true,
//         analysis: savedDoc,
//         document: savedDoc,
//         message: "No new reviews to analyze",
//       });
//     }

//     // 1️⃣ Call ML service
//     const mlResponse = await fetch(`${process.env.ML_SERVICE_URL}/analyze`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ reviews: newReviews }),
//     });

//     if (!mlResponse.ok) {
//       return res.status(500).json({ error: "ML service failed" });
//     }

//     const analysisResult = await mlResponse.json();

//     if (req.user) {
//       if (savedDoc) {
//         // ✅ MERGE COUNTS (CORRECT)
//         savedDoc.totalSentences =
//           (savedDoc.totalSentences || 0) + analysisResult.totalSentences;

//         savedDoc.summaryCounts = mergeCounts(
//           savedDoc.summaryCounts,
//           analysisResult.summaryCounts,
//         );

//         savedDoc.aspectSummary = mergeAspectSummary(
//           savedDoc.aspectSummary,
//           analysisResult.aspectSummary,
//         );

//         /* ======================================================
//            ❌ REMOVED: severityAnalysis merge (WRONG LOGIC)
//            ❌ REMOVED: insights push (DUPLICATION BUG)
//         ====================================================== */

//         // ✅ RECOMPUTE DERIVED DATA INSTEAD
//         savedDoc.severityAnalysis = analysisResult.severityAnalysis;
//         savedDoc.insights = analysisResult.insights;

//         // ✅ STORE PROCESSED REVIEW HASHES
//         savedDoc.processedReviews.push(...newReviewHashes);

//         await savedDoc.save();
//       } else {
//         // 🆕 FIRST ANALYZE → CREATE
//         savedDoc = await Analysis.create({
//           userId: req.user.uid,
//           sessionId,
//           platform,
//           product,
//           totalSentences: analysisResult.totalSentences,
//           summaryCounts: analysisResult.summaryCounts,
//           aspectSummary: analysisResult.aspectSummary,
//           severityAnalysis: analysisResult.severityAnalysis,
//           insights: analysisResult.insights,
//           processedReviews: newReviewHashes,
//         });
//       }
//     }

//     // 3️⃣ Respond
//     res.json({
//       saved: !!req.user,
//       analysis: analysisResult,
//       document: savedDoc,
//     });
//   } catch (err) {
//     console.error("Analyze error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



import fetch from "node-fetch";
import Analysis from "../models/Analysis.js";
import crypto from "crypto";

/* ================= UTILS ================= */

function mergeCounts(oldObj = {}, newObj = {}) {
  const merged = { ...oldObj };
  for (const key in newObj) {
    merged[key] = (merged[key] || 0) + newObj[key];
  }
  return merged;
}

function mergeAspectSummary(oldAspects = {}, newAspects = {}) {
  const merged = { ...oldAspects };

  for (const aspect in newAspects) {
    if (!merged[aspect]) {
      merged[aspect] = { ...newAspects[aspect] };
    } else {
      for (const sentiment in newAspects[aspect]) {
        merged[aspect][sentiment] =
          (merged[aspect][sentiment] || 0) + newAspects[aspect][sentiment];
      }
    }
  }

  return merged;
}

function hashReview(review) {
  return crypto
    .createHash("sha256")
    .update((review.text || "").trim().toLowerCase())
    .digest("hex");
}

/* ================= CONTROLLER ================= */

export const analyze = async (req, res) => {
  try {
    const { platform, product, reviews, sessionId } = req.body;

    console.log("📥 Backend received reviews:");
    console.log("Count:", reviews.length);
    console.log(
      reviews.map((r, i) => ({
        index: i + 1,
        rating: r.rating,
        preview: r.text.slice(0, 60),
      }))
    );

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ error: "Reviews array is required" });
    }

    let savedDoc = null;
    let processedReviews = [];

    if (req.user) {
      savedDoc = await Analysis.findOne({
        userId: req.user.uid,
        sessionId,
      });

      if (savedDoc) {
        processedReviews = savedDoc.processedReviews || [];
      }
    }

    // ✅ filter new reviews
    const newReviews = reviews.filter((r) => {
      const hash = hashReview(r);
      return !processedReviews.includes(hash);
    });

    // ✅ IMPORTANT: still return saved document for history
    if (newReviews.length === 0 && savedDoc) {
      return res.json({
        saved: true,
        analysis: savedDoc, // keep history compatible
        document: savedDoc,
      });
    }

    // ✅ CALL ML WITH ONLY NEW REVIEWS
    const mlResponse = await fetch(`${process.env.ML_SERVICE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews: newReviews }),
    });

    if (!mlResponse.ok) {
      return res.status(500).json({ error: "ML service failed" });
    }

    const analysisResult = await mlResponse.json();

    // ✅ DEFINE HASHES (THIS WAS MISSING)
    const newReviewHashes = newReviews.map(hashReview);

    if (req.user) {
      if (savedDoc) {
        savedDoc.totalSentences += analysisResult.totalSentences;

        savedDoc.summaryCounts = mergeCounts(
          savedDoc.summaryCounts,
          analysisResult.summaryCounts
        );

        savedDoc.aspectSummary = mergeAspectSummary(
          savedDoc.aspectSummary,
          analysisResult.aspectSummary
        );

        // ✅ overwrite derived fields
        savedDoc.severityAnalysis = analysisResult.severityAnalysis;
        savedDoc.insights = analysisResult.insights;

        // ✅ store processed hashes
        savedDoc.processedReviews.push(...newReviewHashes);

        await savedDoc.save();
      } else {
        savedDoc = await Analysis.create({
          userId: req.user.uid,
          sessionId,
          platform,
          product,
          totalSentences: analysisResult.totalSentences,
          summaryCounts: analysisResult.summaryCounts,
          aspectSummary: analysisResult.aspectSummary,
          severityAnalysis: analysisResult.severityAnalysis,
          insights: analysisResult.insights,
          processedReviews: newReviewHashes,
        });
      }
    }

    res.json({
      saved: !!req.user,
      analysis: analysisResult,
      document: savedDoc,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
