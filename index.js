const { response } = require("express");
const express = require("express");
const cors = require("cors");
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

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-1-17T17:30:31.098Z",
    important: false,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2022-1-17T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-1-17T19:20:14.298Z",
    important: true,
  },
];

App.get("/", (request, response) => {
  response.send("Hello woorld there");
});
App.get("/notes", (request, response) => {
  response.json(notes);
});
App.get("/notes/:id", (request, response) => {
  const currentid = Number(request.params.id);
  console.log(currentid);
  const thisNote = notes.find((note) => note.id === currentid);
  if (thisNote) {
    response.json(thisNote);
  } else {
    response
      .status(404)
      .json({ error: 404, message: `there is no note with id ${currentid}` });
  }
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
const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
