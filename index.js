// backend/server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./src/model/MessageModel");
const bodyParser = require("body-parser");

const authRoutes = require("./src/routes/authRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const publicationRoutes = require("./src/routes/publicationRoutes");
const messagesRoutes = require("./src/routes/MessageRoute"); // New route

const app = express();
const server = http.createServer(app);
const PORT = 5000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

let online = [];

io.on("connection", (socket) => {
  console.log("USER: ", socket.id);

  socket.on("connected", (user) => {
    if (!user || !user._id) return;

    // Проверка — если уже есть такой пользователь, не добавлять повторно
    const alreadyOnline = online.find((u) => u.user._id === user._id);
    if (!alreadyOnline) {
      online.push({
        user: user,
        socketId: socket.id,
        status: "online",
      });
    }

    io.emit("online-users", online);
  });

   socket.on("disconnect", () => {
    console.log("USER disconnected: ", socket.id);
    online = online.filter(u => u.socketId !== socket.id);
    io.emit("online-users", online);
  });
});

app.use(express.json());
app.use(cors());

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
