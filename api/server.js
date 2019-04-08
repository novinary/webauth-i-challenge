const express = require("express");
const server = express();

server.use(express.json());

// sanity check route
server.get("/", (req, res) => {
  res.status(200).json({ hello: "World!" });
});

module.exports = server;
