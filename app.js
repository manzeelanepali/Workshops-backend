const { response } = require("express");
const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const Note = require("./models/note");
const middleware = require("./utils/middleware");
const { request } = require("http");
const { errorHandler } = require("./utils/middleware");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const App = express();
App.use(cors());
App.use(express.json());
App.use(express.static("build"));
//  using middleware )
App.use(middleware.requestLogger);
App.use("/api/notes", notesRouter);

App.use("/api/login", loginRouter);

App.use("/api/users", usersRouter);

App.use(middleware.unknownEndpoint);

App.use(middleware.errorHandler);

// this has to be the last loaded middleware.
module.exports = App;
