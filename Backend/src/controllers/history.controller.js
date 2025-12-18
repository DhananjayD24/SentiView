import Analysis from "../models/Analysis.js";

/**
 * ---------------------------------------------------------
 * GET /api/analysis
 * ---------------------------------------------------------
 * PURPOSE:
 * - Fetch complete analysis history of the logged-in user
 *
 * WHO CAN ACCESS:
 * - Only authenticated users
 *
 * HOW IT WORKS:
 * - Uses Firebase UID from req.user
 * - Finds all Analysis documents for that user
 * - Sorts them by newest first
 *
 * USED IN:
 * - Dashboard history page
 */
export const getUserHistory = async (req, res) => {
  // 🔒 Block guest users
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 🔍 Fetch all analyses belonging to this user
    const analyses = await Analysis.find({ userId: req.user.uid })
      .sort({ createdAt: -1 }); // newest first

    // ✅ Send history list to frontend
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};


/**
 * ---------------------------------------------------------
 * GET /api/analysis/:id
 * ---------------------------------------------------------
 * PURPOSE:
 * - Fetch a single analysis in detail
 *
 * WHO CAN ACCESS:
 * - Only the owner of that analysis
 *
 * HOW IT WORKS:
 * - Finds analysis by MongoDB _id
 * - Verifies ownership using Firebase UID
 *
 * USED IN:
 * - View details page
 * - Re-opening saved analysis
 */
export const getAnalysisById = async (req, res) => {
  // 🔒 Block guest users
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 🔍 Find analysis by ID
    const analysis = await Analysis.findById(req.params.id);

    // ❌ If analysis does not exist
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // 🔐 Ownership check
    if (analysis.userId !== req.user.uid) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ Send analysis details
    res.json(analysis);
  } catch (error) {
    console.error("Error fetching analysis:", error.message);
    res.status(500).json({ message: "Failed to fetch analysis" });
  }
};


/**
 * ---------------------------------------------------------
 * DELETE /api/analysis/:id
 * ---------------------------------------------------------
 * PURPOSE:
 * - Delete a specific analysis from user's history
 *
 * WHO CAN ACCESS:
 * - Only the owner of that analysis
 *
 * HOW IT WORKS:
 * - Finds analysis by ID
 * - Confirms ownership
 * - Deletes document from MongoDB
 *
 * USED IN:
 * - Dashboard delete button
 */
export const deleteAnalysis = async (req, res) => {
  // 🔒 Block guest users
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 🔍 Find analysis by ID
    const analysis = await Analysis.findById(req.params.id);

    // ❌ If analysis does not exist
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // 🔐 Ownership check
    if (analysis.userId !== req.user.uid) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 🗑️ Delete analysis
    await analysis.deleteOne();

    // ✅ Confirm deletion
    res.json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting analysis:", error.message);
    res.status(500).json({ message: "Failed to delete analysis" });
  }
};
