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

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/publications", require("./src/routes/publicationRoutes"));
app.use("/api/v1/stories", require("./src/routes/storyRoutes"));
app.use("/api/v1/messages", require("./src/routes/messageRoute"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let online = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("connected", (user) => {
    if (!user || !user._id) return;

    const exists = online.find((u) => u.user._id === user._id);
    if (!exists) {
      online.push({ user, socketId: socket.id, status: "online" });
    }

    io.emit("online-users", online);
  });

  socket.on("message", async (data) => {
    const { from, to, text } = data;

    const saved = await Message.create({
      from: from._id,
      to: to._id,
      text,
    });

    const receiver = online.find((u) => u.user._id === to._id);
    const sender = online.find((u) => u.user._id === from._id);

    if (receiver) io.to(receiver.socketId).emit("message", saved);
    if (sender) io.to(sender.socketId).emit("message", saved);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    online = online.filter((u) => u.socketId !== socket.id);
    io.emit("online-users", online);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
