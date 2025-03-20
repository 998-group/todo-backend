const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const { default: GeneratorID } = require("./utils/GeneratorID");
const connectDB = require("./config/db");
=======
const GeneratorID = require("./utils/GeneratorID"); // .default olib tashlandi
>>>>>>> 2bda2f702976e587229f4baccef078fa8240de50
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
  },
];
const publication = [];
const addStories = [];

<<<<<<< HEAD
connectDB()

=======
// LOGIN ENDPOINT
>>>>>>> 2bda2f702976e587229f4baccef078fa8240de50
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

<<<<<<< HEAD

=======
// REGISTER ENDPOINT
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
    id: GeneratorID(),
    firstName,
    lastName,
    password,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});
>>>>>>> 2bda2f702976e587229f4baccef078fa8240de50

// GET USERS
app.get("/api/v1/users", (req, res) => {
  res.json(users);
});

// CREATE PUBLICATION
app.post("/api/v1/publications", (req, res) => {
  const { user, posts, description } = req.body;

  if (!user || !posts || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const post = {
    id: GeneratorID(),
    author: user,
    posts,
    like: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  publication.unshift(post);
  res.status(201).json({ message: "Post created successfully", post });
});

<<<<<<< HEAD
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
=======
// GET ALL PUBLICATIONS
>>>>>>> 2bda2f702976e587229f4baccef078fa8240de50
app.get("/api/v1/publications", (req, res) => {
  res.json({ publication });
});

// LIKE PUBLICATION
app.put("/api/v1/publications/:id/like", (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const post = publication.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!post.like.includes(user)) {
    post.like.push(user);
  }

  res.status(200).json({ message: "Post liked successfully", post });
});

// ADD STORY
app.post("/api/v1/addStories", (req, res) => {
  const { title, content, addPhoto, addVideo } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const story = {
    id: GeneratorID(),
    title,
    content,
    addPhoto: addPhoto || "",
    addVideo: addVideo || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  addStories.push(story);

  res.status(201).json({ message: "Story added successfully", story });
});

// GET ALL STORIES
app.get("/api/v1/addStories", (req, res) => {
  res.status(200).json({ stories: addStories });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
