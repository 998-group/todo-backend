const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Assumes you have a db config file
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./model/MessageModel"); // Assumes this model exists
const app = express();
const bodyParser = require("body-parser");

const server = http.createServer(app);
const PORT = 5000;

const authRoutes = require("./routes/authRoutes"); // Assumes this exists
const storyRoutes = require("./routes/storyRoutes"); // Assumes this exists
const publications = require("./routes/publicationRoutes");

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

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", storyRoutes);
app.use("/api/v1/publications", publications);
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});