const { response } = require("express");
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");
const { request } = require("http");
const App = express();
App.use(cors());
App.use(express.json());
App.use(express.static("build"));
//  using middleware )
App.use((request, response, next) => {
  console.log("Method:", request.method);
  console.log("path:", request.path);
  console.log("This is middlewear");
  response.someThis = "Hello world ";

  next();
});

App.get("/", (request, response) => {
  response.send("Hello woorld there");
});

const notes = [];
App.get("/notes", (request, response) => {
  Note.find().then((result) => response.json(result));
  // response.json(notes);
});
App.get("/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
      // response.status(500).end();
      // response.status(400).send({ error: "malformatted id" });
    });
});
App.delete("/notes/:id", (request, response) => {
  const currentid = Number(request.params.id);
  notes = notes.filter((note) => note.id !== currentid);
  // console.log(currentid);
  // const thisNote = notes.find((note) => note.id === currentid);

  response.status(204).end();
  // .json({ error: 404, message: `there is no note with id ${currentid}` });
});
App.post("/notes/", (request, response) => {
  let myIncomingData = request.body;
  myIncomingData.id = notes.length + 1;
  notes.push(myIncomingData);
  // console.log(myIncomingData);
  // response.status(204).end();
  response.status(201).json(myIncomingData);
});
// App.use((request, response, next) => {
//   response.status(404).send("<h1> No Project found for this request</h1>");
// });
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
App.use(errorHandler);
const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
