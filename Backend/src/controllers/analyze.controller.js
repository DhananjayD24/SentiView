import Analysis from "../models/Analysis.js";

export const analyze = async (req, res) => {
  const { type, content } = req.body;

  if (!type || !content) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // 🔹 MOCK RESULT (matches your frontend)
  const mockResult = {
    productName: type === "product" ? "Sample Product" : "Custom Review",
    productLink: type === "product" ? content : null,
    overallSentiment: "positive",
    sentimentScore: 0.42,
    positiveCount: 12,
    negativeCount: 4,
    neutralCount: 3,
    totalReviews: 19,
    topPositiveKeywords: [{ word: "camera", count: 6 }],
    topNegativeKeywords: [{ word: "battery", count: 3 }],
    reviews: [
      {
        id: "1",
        text: "Great camera quality",
        sentiment: "positive",
        score: 0.8
      }
    ]
  };

  // 🔹 Save only if logged in
  if (req.user) {
    await Analysis.create({
      userId: req.user.id,
      inputType: type,
      inputValue: content,
      result: mockResult
    });
  }

  res.json(mockResult);
};
