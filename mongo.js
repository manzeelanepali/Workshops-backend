const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ManjilaNep:${password}@cluster0.6bqbifp.mongodb.net/NewData?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const note = new Note({
      content: "js  is hard",
      date: new Date(),
      important: false,
    });

    return note.save();
  })
  //     const notes = Note.find({ important: false });
  //     return notes;
  //   })

  .then((result) => {
    console.dir(result);
    console.log("note saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
