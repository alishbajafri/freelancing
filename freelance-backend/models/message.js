import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema, "messages"); 
// 👆 third argument forces collection name => freelanceDB.messages
