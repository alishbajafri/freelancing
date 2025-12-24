import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

// ✅ GET single review by id
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findOne({ id: req.params.id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Error fetching review", error });
  }
});

router.get("/freelancer/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
    res.json({ reviews, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});


export default router;
