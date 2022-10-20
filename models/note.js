const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

module.exports = mongoose.model("Note", noteSchema);
