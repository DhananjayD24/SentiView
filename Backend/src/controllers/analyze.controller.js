import fetch from "node-fetch";
import Analysis from "../models/Analysis.js";

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

export const analyze = async (req, res) => {
  try {
    const { platform, product, reviews, sessionId } = req.body;

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
      // 🔍 FIND EXISTING SESSION
      savedDoc = await Analysis.findOne({
        userId: req.user.uid,
        sessionId,
      });

      if (savedDoc) {
        savedDoc.totalSentences =
          (savedDoc.totalSentences || 0) + analysisResult.totalSentences;

        savedDoc.summaryCounts = mergeCounts(
          savedDoc.summaryCounts,
          analysisResult.summaryCounts,
        );

        savedDoc.aspectSummary = mergeAspectSummary(
          savedDoc.aspectSummary,
          analysisResult.aspectSummary,
        );

        savedDoc.severityAnalysis = mergeCounts(
          savedDoc.severityAnalysis,
          analysisResult.severityAnalysis,
        );

        // 🔒 ENSURE INSIGHTS STRUCTURE
        savedDoc.insights ||= {
          reasonsToBuy: [],
          reasonsToAvoid: [],
          mixedAspects: [],
        };

        savedDoc.insights.reasonsToBuy.push(
          ...analysisResult.insights.reasonsToBuy,
        );
        savedDoc.insights.reasonsToAvoid.push(
          ...analysisResult.insights.reasonsToAvoid,
        );
        savedDoc.insights.mixedAspects.push(
          ...analysisResult.insights.mixedAspects,
        );

        await savedDoc.save();
      } else {
        // 🆕 FIRST ANALYZE → CREATE
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
        });
      }
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
