const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  publication: { type: mongoose.Schema.Types.ObjectId, ref: "998publication", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "998user", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("comment998", commentSchema);
