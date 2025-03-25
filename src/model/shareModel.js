const mongoose = require("mongoose");

const shareModel = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "998User", required: true },
  share: { type: Number, default: 0 }
});




module.exports =  mongoose.model("Share", shareModel);;
