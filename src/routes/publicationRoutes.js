const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Import Mongoose Models
const Publication = require("../models/publicationModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");
const Save = require("../models/saveModel");
const Share = require("../models/shareModel");
const View = require("../models/viewModel");

// ✅ View all publications (following or all if no following)
router.get("/", async (req, res) => {
  try {
    const user = req.user; // Assume user data is stored in req.user

    let publications;
    if (user.following.length > 0) {
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

// ✅ View a single publication by ID
router.get("/:id", async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id).populate("author", "username");
    if (!publication) return res.status(404).json({ success: false, message: "Publication not found" });

    // Add a view to this publication
    await View.create({ publication: req.params.id, user: req.user.id });

    res.status(200).json({ success: true, publication });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Delete a publication by ID
router.delete("/:id", async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Publication deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Edit a publication by ID
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

// ✅ Like a publication by ID
router.post("/:id/like", async (req, res) => {
  try {
    const like = await Like.create({ publication: req.params.id, user: req.user.id });
    res.status(200).json({ success: true, like });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Comment on a publication by ID
router.post("/:id/comment", async (req, res) => {
  try {
    const comment = await Comment.create({
      publication: req.params.id,
      user: req.user.id,
      text: req.body.text,
    });
    res.status(200).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Save a publication by ID
router.post("/:id/save", async (req, res) => {
  try {
    const save = await Save.create({ publication: req.params.id, user: req.user.id });
    res.status(200).json({ success: true, save });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Share a publication by ID
router.post("/:id/share", async (req, res) => {
  try {
    const share = await Share.create({
      publication: req.params.id,
      user: req.user.id,
      sharedTo: req.body.sharedTo,
    });
    res.status(200).json({ success: true, share });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
