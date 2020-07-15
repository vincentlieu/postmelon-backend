const express = require("express");
const app = express();
const connectDB = require("./config/db");

app.get("/", (req, res) => res.send("API RUNNING"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Server running on port ${PORT}`));

// connect to database

connectDB();
