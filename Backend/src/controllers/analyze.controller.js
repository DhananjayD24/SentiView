import fetch from "node-fetch";
import Analysis from "../models/Analysis.js";

export const analyze = async (req, res) => {
  try {
    const { platform, product, reviews } = req.body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ error: "Reviews array is required" });
    }
    console.log("PRODUCT RECEIVED:", product);


    // 1️⃣ Call ML service
    const mlResponse = await fetch(`${process.env.ML_SERVICE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews }),
    });

    if (!mlResponse.ok) {
      return res.status(500).json({ error: "ML service failed" });
    }

    const analysisResult = await mlResponse.json();

    // 2️⃣ Save analysis if user is logged in
    let savedDoc = null;

    if (req.user) {
      savedDoc = await Analysis.create({
        userId: req.user.uid,
        platform,
        product,
        summaryCounts: analysisResult.summaryCounts,
        aspectSummary: analysisResult.aspectSummary,
        severityAnalysis: analysisResult.severityAnalysis,
        insights: analysisResult.insights,
      });
    }

    // 3️⃣ Respond
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

