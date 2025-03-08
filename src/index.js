const express = require("express");
const cors = require("cors");
const PORT = 5000;

const app = express();
<<<<<<< HEAD
app.use(express.json());
=======
app.use(express.json())
>>>>>>> b34e337a853f7d30bc11988f978b3cefc695f88d
app.use(cors());

const users = [
  {email: "madalievsardor33@gmail.com", password: "admin"}
];

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

app.post("/api/v1/login", (req, res) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> b34e337a853f7d30bc11988f978b3cefc695f88d
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
