const bcrypt = require("bcrypt");
const Users = require("./users-model");
const express = require("express");
const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send("It's alive!");
});

// [POST] /api/register
server.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, pass.username);
  user.password = hash;
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// [POST] /api/login
server.post("/api/login", (req, res) => {
  let { username, password } = req.body;
  //const hash = bcrypt.hashSync(user.password, 10);
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// [GET]/api/users
server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

const port = process.env.PORT || 2500;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
