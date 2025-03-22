const mongoose = require("mongoose");

const userStorySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  publicationDate: { type: Date, default: Date.now },
  status: { type: String, default: "active", enum: ["active", "inactive"] },
  stories: [
    {
      thumbnail: { type: String, require: false },
      video: { type: String, require: false },
    },
  ],
});

// Автоматическая проверка перед запросами (middleware)
userStorySchema.pre("find", function (next) {
  const now = new Date();
  this.updateMany(
    { publicationDate: { $lte: new Date(now - 24 * 60 * 60 * 1000) } },
    { status: "inactive" }
  ).exec();
  next();
});

module.exports = mongoose.model("UserStory", userStorySchema);
