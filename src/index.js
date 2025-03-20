const express = require("express");
const cors = require("cors");
const { default: GeneratorID } = require("./utils/GeneratorID");
const connectDB = require("./config/db");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {
    id: 1,
    firstName: "Doni",
    lastName: "Qochqorova",
    phone: "1234567890",
    password: "password123",
    email: "",
  },
];
const publication = [];

connectDB()

app.post("/api/v1/login", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(
    (user) => user.phone === phone && user.password === password
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
      phone: user.phone,
    },
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

// view all story
app.get('/api/v1/stories', (req, res) => {

})

// view single story
app.get('/api/v1/stories/:id', (req, res) => {

})

// create a new story
app.post('/api/v1/stories', (req, res) => {

})

app.delete('/api/v1/stories/:id', (req, res) => {

})

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
