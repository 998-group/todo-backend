const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  publication: { type: mongoose.Schema.Types.ObjectId, ref: "998publication", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "998user", required: true },
  sharedTo: { type: mongoose.Schema.Types.ObjectId, ref: "998user" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("998share", shareSchema);
