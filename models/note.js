const mongoose = require("mongoose");
require("dotenv").config();
let url;
if (process.env.NODE_ENV === "DEV") {
  url = process.env.MONGODB_URI_PROD;
} else {
  url = process.env.MONGODB_URI_DEV;
}

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
  content: {
    type: String,
    minLength: 5,
    require: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Note", noteSchema);
