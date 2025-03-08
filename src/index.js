const express = require("express");
const cors = require("cors");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  { id: 1, firstName: "Doni", lastName: "Qochqorova", phone: "1234567890", password: "password123", email: ""},
];

app.post("/api/v1/login", (req, res) => {
  const { phone, password } = req.body; 
  const user = users.find((user) => user.phone === phone && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Login successful",
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone },
  });
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

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
