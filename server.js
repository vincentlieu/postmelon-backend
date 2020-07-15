const express = require("express");
const app = express();
const connectDB = require("./config/db");

app.get("/", (req, res) => res.send("API RUNNING"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Server running on port ${PORT}`));

// connect to database

connectDB();

// define routes

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
