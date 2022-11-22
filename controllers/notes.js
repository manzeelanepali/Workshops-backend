const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const myNotes = await Note.find({}).populate("user", {
    name: 1,
    username: 1,
  });
  response.json(myNotes);
});

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  console.log(" This is a decoded Token ", decodedToken);
  const user = await User.findById(decodedToken.id);
  console.log(" This is my user", user);

  if (!body.content) {
    return response.status(400);
  } else {
    const currentUser = await User.findById(user._id);
    console.log("this is user", currentUser);
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
      user: user._id,
    });
    console.log(note);

    try {
      const newNote = await note.save();
      user.notes.concat(newNote._id);
      user.save();

      response.status(201).json(newNote);
    } catch (error) {
      next(error);
    }
  }
});

// .then((savedNote) => {
//   response.status(201).json(savedNote);
// })
// .catch((error) => next(error));

notesRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndRemove(request.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
