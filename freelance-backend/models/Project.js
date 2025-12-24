import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true },      // string, matches MongoDB
  title: String,
  status: String,
  category: [String],
  budget: String,
  deadline: String,
  skills: [String],
  client: String,
  description: String,
  location: String,
  postedTime: Date,
  proposals: { type: Number, default: 0 },           // default to 0
  proposalStatus: { type: String, default: null },   // new field
  milestones: Array
});

// Explicitly set collection to 'projects'
export default mongoose.model("Project", projectSchema, "projects");
