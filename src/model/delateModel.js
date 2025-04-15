const mongoose = require("mongoose")

const delateSchema = mongoose.Schema({
    publication: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "publication998" },   
    user: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "998User"},
    like: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "998like"},
})

module.exports = mongoose.model('998Delate', delateSchema )