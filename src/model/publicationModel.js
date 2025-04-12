const mongoose = require("mongoose");

const publicationSchema = mongoose.Schema({
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: false,
    trim: true,
  },
  location: {
    type: String,
    required: false,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "998User", // Assumes your User model is named "998user"
    required: true,
  },
});

module.exports = mongoose.model("publication998", publicationSchema);