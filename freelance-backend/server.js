import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import projectRoutes from "./routes/projectRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoute from "./routes/userRoute.js";
import conversationsRoutes from "./routes/conversationsroutes.js";
import messagesRoutes from "./routes/messagesroutes.js";  // << ADD THIS (if you have message APIs)
import profileRoute from "./routes/profileRoute.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ----------------------------
// SOCKET.IO SETUP
// ----------------------------
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// Store online users
let onlineUsers = {};

// When someone connects
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // When a user comes online
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("🟢 User joined:", userId);
  });

  // When sending a message
  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    const receiverSocket = onlineUsers[receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
      console.log("📩 Message sent to:", receiverId);
    }
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    // Remove from online users
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

// ----------------------------
// Middleware
// ----------------------------
app.use(cors());
app.use(express.json());

// ----------------------------
// MongoDB Connection
// ----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ----------------------------
// Routes
// ----------------------------
app.get("/", (req, res) => res.send("Freelance App Backend is running 🚀"));

app.use("/projects", projectRoutes);
app.use("/earnings", earningRoutes);
app.use("/reviews", reviewRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoute); // ✅ so GET /users/:id works
app.use("/conversations", conversationsRoutes);
app.use("/messages", messagesRoutes); // << ADD THIS (if you have message routes)
app.use("/profile", profileRoute);

// ----------------------------
// Start Server
// ----------------------------
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
