const mongoose = require("mongoose");

const likeModel = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "998User", required: true },
  like: { type: Number, default: 0 }
});

module.exports = mongoose.model("Like", likeModel);