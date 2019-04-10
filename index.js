const bcrypt = require("bcrypt");
const Users = require("./users-model");
const express = require("express");
const server = express();
const session = require("express-session");
const KnexSessionStore = require('connect-session-knex')(session);
const configuredKnex = require('./database/dbConfig.js');

// cookies setup
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
    store: new KnexSessionStore({   // constructor and pass in object
        knex: configuredKnex,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 10, //delete expires sessions
    }),
};

server.use(express.json());
server.use(session(sessionConfig));

// endpoints
server.get("/", (req, res) => {
    res.send("It's alive!");
});

// [POST] /api/register
server.post("/api/register", (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
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

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                // req.session is added by expression-session
                req.session.user = user;

                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
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
