const UserStory = require("../model/StoryModel");
const express = require("express");
const router = express.Router();

// storyni qo'shish apisi
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

// ID bo'yicha storyni o'chirish
router.delete("/story/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid story ID." });
  }

  try {
    const story = await UserStory.findByIdAndDelete(id);
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }
    res.json({ message: "Story deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete story." });
  }
});

// ID bo'yicha storyni tahrirlash

router.patch("/story/:id", async (req, res) => {
  const { id } = req.params;
  const { stories } = req.body;

  if (!id || stories.length === 0) {
    return res.status(400).json({ error: "Invalid story ID or stories." });
  }

  try {
    const story = await UserStory.findByIdAndUpdate(
      id,
      { stories },
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

// ID bo'yicha faqat single view (1ta story) ko'rish

router.get("/story/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid story ID." });
  }

  try {
    const story = await UserStory.findById(id)
     .populate("author", "name avatar")
     .exec();
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }
    res.json({ story });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch story." });
  }
});

// barcha storylarni ko'rish (author ga teng bo'lish)

router.get("/story/author/:author", async (req, res) => {
  const { author } = req.params;

  if (!author) {
    return res.status(400).json({ error: "Invalid author name." });
  }

  try {
    const stories = await UserStory.find({ author, status: "active" })
     .populate("author", "name avatar")
     .exec();
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories." });
  }
});

module.exports = router;
