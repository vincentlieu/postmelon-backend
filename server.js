const express = require("express");
const app = express();
const connectDB = require("./config/db");
const usersRouter = require("./routes/api/users");

app.get("/", (req, res) => res.send("API RUNNING"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Server running on port ${PORT}`));

// init middleware

app.use(express.json({ extended: false }));

// connect to database

connectDB();

// define routes

app.use("/api/users", usersRouter);
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
