const express = require("express");
const router = express.Router();
const Publication = require("../model/publicationModel");
const Like = require("../model/likeModel"); // Assumes this exists
const Comment = require("../model/commentModel"); // Assumes this exists
const Save = require("../model/saveModel"); // Assumes this exists
const Share = require("../model/shareModel"); // Assumes this exists
const View = require("../model/viewsModel"); // Assumes this exists
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Create a new publication
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { description, location, author } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    const newPublication = new Publication({
      images: imagePaths,
      description,
      location,
      author,
    });

    await newPublication.save();
    res.status(201).json({ success: true, publication: newPublication });
  } catch (error) {
    console.error("Error creating publication:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// View all publications (following or all if no following)
router.get("/", async (req, res) => {
  try {
    const user = req.user; // Assumes user is attached via middleware
    let publications;
    if (user && user.following.length > 0) {
      publications = await Publication.find({ author: { $in: user.following } })
        .populate("author", "username")
        .sort({ createdDate: -1 });
    } else {
      publications = await Publication.find()
        .populate("author", "username")
        .sort({ createdDate: -1 });
    }
    res.status(200).json({ success: true, publications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// View a single publication by ID
router.get("/:id", async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id).populate("author", "username");
    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found" });
    }
    await View.create({ publication: req.params.id, user: req.user?.id });
    res.status(200).json({ success: true, publication });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a publication by ID
router.delete("/:id", async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Publication deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Edit a publication by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ success: true, updatedPublication });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Like a publication by ID
router.post("/:id/like", async (req, res) => {
  try {
    const like = await Like.create({ publication: req.params.id, user: req.user?.id });
    res.status(200).json({ success: true, like });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Comment on a publication by ID
router.post("/:id/comment", async (req, res) => {
  try {
    const comment = await Comment.create({
      publication: req.params.id,
      user: req.user?.id,
      text: req.body.text,
    });
    res.status(200).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Save a publication by ID
router.post("/:id/save", async (req, res) => {
  try {
    const save = await Save.create({ publication: req.params.id, user: req.user?.id });
    res.status(200).json({ success: true, save });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Share a publication by ID
router.post("/:id/share", async (req, res) => {
  try {
    const share = await Share.create({
      publication: req.params.id,
      user: req.user?.id,
      sharedTo: req.body.sharedTo,
    });
    res.status(200).json({ success: true, share });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;