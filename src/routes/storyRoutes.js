const userstory = require("../model/StoryModel");
const express = require("express");
const router = express.Router();

router.post("/story", async (req, res) => {
  const { author, stories } = req.body;
  if (!author || stories.length === 0) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newStory = new userstory({ author, stories });
    await newStory.save();
    res.status(201).json({ message: "Story saved successfully.", newStory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create story." });
  }
});

router.get("/story", async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Your are not authorized" });
  }

  try {
    const stories = await userstory.find();
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories." });
  }
});

module.exports = router;
