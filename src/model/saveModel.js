const mongoose = require("mongoose");

// Define the Save schema
const saveModel = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "998User", 
    required: true 
  },
  save: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps


module.exports = mongoose.model("Save", saveModel);;
