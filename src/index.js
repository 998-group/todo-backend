const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./model/MessageModel"); // <-- Message modelini to‘g‘ri ulang
const app = express();

const server = http.createServer(app);
const PORT = 5000;

const authRoutes = require("./routes/authRoutes");
const storyRoutes = require("./routes/storyRoutes");

app.use(express.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const onlineUsers = new Map(); // userID -> socketId

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_message", async ({ senderId, receiverId, text }) => {
    const message = await Message.create({ senderId, receiverId, text });

    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", message);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", storyRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
