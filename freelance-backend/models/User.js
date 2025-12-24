import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // 🔥 required for login
    role: {
      type: String,
      enum: ["freelancer", "client", "admin"],   // 🔥 role-based UI
      default: "freelancer",
    },
    skills: [String],
    bio: String,
    pricing: String,
    avatar: String,
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
