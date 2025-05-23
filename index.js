const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./src/model/MessageModel");
const bodyParser = require("body-parser");
const userModel = require("./src/model/userModel");

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
app.use("/api/v1/messages", require("./src/routes/MessageRoute"));

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

    // Сохраняем сообщение
    const saved = await Message.create({
      from: from._id,
      to: to._id,
      text,
    });

    // Загружаем данные отправителя и получателя
    const senderUser = await userModel
      .findOne({ _id: from._id })
      .select("_id username"); // Выберите нужные поля
    const receiverUser = await userModel
      .findOne({ _id: to._id })
      .select("_id username");

    // Находим сокеты отправителя и получателя
    const receiver = online.find((u) => u.user._id === to._id);
    const sender = online.find((u) => u.user._id === from._id);

    // Отправляем сообщение получателю (с данными отправителя)
    if (receiver) {
      io.to(receiver.socketId).emit("message", {
        user: senderUser, // Отправляем данные отправителя
        saved,
      });
    }

    // Отправляем сообщение отправителю (с данными получателя)
    if (sender) {
      io.to(sender.socketId).emit("message", {
        user: receiverUser, // Отправляем данные получателя
        saved,
      });
    }
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
