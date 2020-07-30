mongoose = require("mongoose");
const config = require("config");

const db = config.get("ATLAS_URI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
