const mongoose = require("mongoose");

const publicationModel = mongoose.Schema({
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "998user",
    required: true,
  },
});

module.exports = mongoose.model("998publication", publicationModel);
