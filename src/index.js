const express = require("express");
const cors = require("cors");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {email: "madalievsardor33@gmail.com", password: "admin"}
];

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

app.post("/api/v1/login", (req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({message: "Please provide all fields"})
  }

  const existingUser = users.find((user) => user.email === email && user.password === password);

  if(!existingUser) {
    return res.status(400).json({message: "Email or password not defined"})
  }

  res.status(201).json({
    message: "User loginned successfully",
    user: {email, password}
  })
});

app.post("/api/v1/register", (req, res) => {
  const { firstName, lastName, password, email } = req.body;
  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: { firstName, lastName, password, email },
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
