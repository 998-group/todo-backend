const express = require("express");
const cors = require("cors");
const PORT = 5000;

const app = express();
app.use(express.json())
app.use(cors());

const users = [];

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

app.post("/api/v1/login", (req, res) => {
  const { phone, password} = req.body;

  if(!phone || !password) {
    return res.status(400).json({ message: "Please provide all fields"});
  }
  const existingUser = users.find(
    (user) => user.phone === phone && user.password === password
  );

  if(!existingUser) {
    return res
    .status(400)
    .json({ message: "Incorrect phone or password"});
  }
  res.status(200).json({ message: "Login successfully",
    user: { username: existingUser.username, phone: existingUser.phone}
  });
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
