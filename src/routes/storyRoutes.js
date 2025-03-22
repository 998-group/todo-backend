const UserStory = require("../model/StoryModel");
const express = require("express");
const router = express.Router();


router.post("/story", async (req, res) => {
  const { author, stories } = req.body;
  if (!author || stories.length === 0) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newStory = new UserStory({ author, stories });
    await newStory.save();
    res.status(201).json({ message: "Story saved successfully.", newStory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create story." });
  }
});

// barcha storylarni ko'rish
router.get("/story", async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  try {
    const stories = await UserStory.find({ status: "active" }).populate(
      "author",
      "name avatar"
    );
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories." });
  }
});


// ID bo'yicha active yoki inactive qilish
router.put("/story/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Invalid story ID." });
  }

  try {
    const story = await UserStory.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }
    res.json({ message: "Story updated successfully.", story });
  } catch (error) {
    res.status(500).json({ error: "Failed to update story." });
  }
});

module.exports = router;
