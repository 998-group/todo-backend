// backend/model/MessageModel.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String, // or mongoose.Schema.Types.ObjectId if using MongoDB ObjectIds
      required: true,
    },
    receiverId: {
      type: String, // or mongoose.Schema.Types.ObjectId
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);