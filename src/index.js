const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = 5000;

const authRoutes = require("./routes/authRoutes")
const storyRoutes = require("./routes/storyRoutes")

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/v1/', authRoutes)
app.use('/api/v1/', storyRoutes);

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
