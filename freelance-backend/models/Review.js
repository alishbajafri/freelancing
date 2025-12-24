import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  title: String,
  rating: Number
});

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userName: String,
  projectTitle: String,
  comment: String,
  duration: String,
  communication: Number,
  quality: Number,
  punctuality: Number,
  milestones: [MilestoneSchema]
});

// Explicitly set collection to 'reviews'
export default mongoose.model("Review", ReviewSchema, "reviews");
