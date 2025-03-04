const express = require("express");
const cors = require("cors");
const PORT = 5000;

const app = express();
app.use(cors());

const users = [];

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

app.post("/api/v1/login", (req, res) => {
  res.json(users);
});

app.post("/api/v1/register", (req, res) => {
  const { username, password, phone } = req.body;

  if (!username || !password || !phone) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const existingUser = users.find(
    (user) => user.username === username || user.phone === phone
  );

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Username or phone already exists" });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: { username, password, phone },
  });
});

app.listen(PORT, () => {
  console.log(
    `================================================================`
  );
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server created by Bekzod Mirzaaliyev`);
  console.log(
    `================================================================`
  );
});
