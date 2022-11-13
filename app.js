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

App.get("/", (request, response) => {
  response.send("Hello woorld there");
});

const notes = [];
App.get("/api/notes", (request, response) => {
  Note.find().then((result) => {
    console.log(result, "this is ");
    response.json(result);
  });
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
App.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

console.log(request.body);
App.post("/api/notes", (request, response, next) => {
  const body = request.body;
  console.log(body, "this is body");

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });
  console.log(note);
  note
    .save()
    .then((savednotes) => {
      response.json(savednotes);
    })
    .catch((error) => next(error));
});

// App.post("/api/notes", (request, response) => {
//   console.log("I sm 9");
//   const body = request.body;

//   if (body.content === undefined) {
//     return response.status(400).json({ error: "content missing" });
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//   });

//   note.save().then((savedNote) => {
//     response.json(savedNote);
//   });
// });
App.put("/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// this has to be the last loaded middleware.
App.use(errorHandler);
