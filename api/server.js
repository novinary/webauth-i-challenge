const express = require("express");
const server = express();
/*const session = require("express-session");

const sessionConfig = {
  name: 'monster',
  secret: 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 10,// milliseconds
    secure: false, // use cookie over https
    httpOnly: true, // false means can JS access the coookie on the client
  },
  resave: false, // avoid recreating existing sessions
  saveUniinitialized: false, // GDPR compliance
};
*/

server.use(express.json());
//server.use(session(sessionConfig));

// sanity check route
server.get("/", (req, res) => {
  res.status(200).json({ hello: "World!" });
});

module.exports = server;
