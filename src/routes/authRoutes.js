const express = require("express");
const bcrypt = require("bcryptjs"); // Добавляем bcrypt для шифрования пароля
const User = require("../model/userModel"); // Используем с заглавной буквы

const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
  const { firstName, lastName, password, phone } = req.body;

  if (!firstName || !lastName || !password || !phone) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists." });
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);
  
    //3151516 = ih249 oi;jr4o rv32904ui9834u32894y327840

    const newUser = new User({ firstName, lastName, password: hashedPassword, phone });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Логин
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required." });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid phone or password." });
    }

    res.json({ message: "User logged in successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in user." });
  }
});

module.exports = router;
