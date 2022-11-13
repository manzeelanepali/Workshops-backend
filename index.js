const app = require("./app"); // the actual Express application
const http = require("http");
const config = require("./utils/config");
// const logger = require("./utils/logger");

const server = http.createServer(app);
const PORT = process.env.PORT || "3001";

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
