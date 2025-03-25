const mongoose = require("mongoose");

const commentModel = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "998User", required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("Comment", commentModel);