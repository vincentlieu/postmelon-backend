const express = require("express");
const app = express();
const connectDB = require("./config/db");

const usersRouter = require("./routes/api/users");
const authRouter = require('./routes/api/auth');
const postsRouter = require('./routes/api/posts');
const profileRouter = require('./routes/api/profile');

app.get("/", (req, res) => res.send("API RUNNING"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Server running on port ${PORT}`));

// INITIALISE MIDDLEWEAR
app.use(express.json({ extended: false }));

//CONNECT TO DATABASE
connectDB();

// DEFINE ROUTES
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/profile", profileRouter);
