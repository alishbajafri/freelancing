import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: {
    type: [String],
    required: true,
  },
  client: {
    id: String,
    name: String,
    avatar: String
  },
  lastMessage: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationSchema);
