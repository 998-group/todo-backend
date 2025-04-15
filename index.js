// backend/server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./src/model/MessageModel");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const PORT = 5000;

const authRoutes = require("./src/routes/authRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const publicationRoutes = require("./src/routes/publicationRoutes");
const messagesRoutes = require("./src/routes/MessageRoute"); // New route

app.use(express.json());
app.use(cors());

const io = new Server(server, {
  cors: { origin: "*" },
});
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("send_message", async ({ senderId, receiverId, text }) => {
    try {
      const message = await Message.create({ senderId, receiverId, text });
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", message);
      }
      // Also emit to sender to confirm (optional, if client doesn't auto-add)
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("receive_message", message);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", storyRoutes);
app.use("/api/v1/publications", publicationRoutes);
app.use("/api/v1/", messagesRoutes); // Add messages route

app.use("/uploads", express.static("uploads"));

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});