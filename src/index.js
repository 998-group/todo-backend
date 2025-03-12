const express = require("express");
const cors = require("cors");
// const { default: GeneratorID } = require("./utils/GeneratorID");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {
    id: 1,
    firstName: "Sardor",
    lastName: "Madaliev",
    phone: "901232323",
    password: "admin",
    email: "madalievsardor33@gmail.com",
  },
];

const publication = [];

app.post("/api/v1/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
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

  const newUser = {
    // id: GeneratorID(),
    firstName,
    lastName,
    phone: "",
    password,
    email,
    date: new Date().toISOString()
  }
  users.push(newUser);
  res.status(201).json({
    message: "User registered successfully",
    user: newUser
  });
});

app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

// создать публикацию
app.post("/api/v1/publications", (req, res) => {
  const { user, posts, description } = req.body;

  if (!user || !posts || !description) {
    return res.status(400).json({ message: "you must fill in the all fields" });
  }

  const post = {
    id: GeneratorID(),
    author: user,
    posts,
    like,
    comments,
    createdAt: new Date().toISOString(),
  };

  publication.unshift(post);
  res.status(201).json({ message: "Post created successfully", post });
});

// Все публикации
app.get("/api/v1/publications", (req, res) => {
  res.json({ publication });
});

// лайкать публикацию

// http://localhost:8000/api/v1/publications/47832075820752483/like

app.put("/api/v1/publications/:id/like", (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const postIndex = publication.find((post) => post.id === parseInt(id));

  if (!postIndex) {
    return res.status(404).json({ message: "Post not found" });
  }

  postIndex.like.push(user);

  res
    .status(200)
    .json({ message: "Post liked successfully", post: publication[postIndex] });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
