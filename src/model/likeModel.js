const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  publication: { type: mongoose.Schema.Types.ObjectId, ref: "998publication", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "998user", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("998like", likeSchema);
