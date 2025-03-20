const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false, unique: false },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "student", "moderator"],
    default: "user",
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  avatar: { type: String, required: false, default: "https://img.freepik.com/free-vector/contact-icon-3d-vector-illustration-blue-button-with-user-profile-symbol-networking-sites-apps-cartoon-style-isolated-white-background-online-communication-digital-marketing-concept_778687-1715.jpg"},
  bio: { type: String, required: false },
  phone: { type: String, required: true, unique: true},
});

module.exports = mongoose.model("User", userSchema);
