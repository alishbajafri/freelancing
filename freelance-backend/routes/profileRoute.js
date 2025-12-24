import express from "express";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET profile with projects and reviews
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Fetch user (first user in DB for simplicity)
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Fetch user's projects
    const projects = await Project.find({ userId: user._id });

    // 3️⃣ Fetch user's reviews
    const reviews = await Review.find({ userId: user._id });

    // 4️⃣ Return combined response
    res.json({
      ...user.toObject(),
      projects,
      reviews,
    });
  } catch (err) {
    console.error("Error fetching profile data:", err);
    res.status(500).json({ message: "Error fetching profile data", error: err });
  }
});

// PUT update profile
router.put("/", async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, req.body);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile", error: err });
  }
});

export default router;
