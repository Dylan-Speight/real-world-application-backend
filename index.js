const mongoose = require("mongoose");
const express = require("express")
const bodyParser = require("body-parser")
// const jwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware/auth');

const cors = require('cors');
const User = require('./models/User.js');

const corsOptions = {
    origin: 'http://localhost:3000'
}
// const Schema = mongoose.Schema;
const secret = 'mysecretsshhh';

const app = express()
const port = 4000
app.use(cors());
app.use(cookieParser());
const mongo_uri = "mongodb://localhost/usersdb"
mongoose.connect(mongo_uri, function(err) {
    if (err) {
      throw err;
    } else {
      console.log(`Successfully connected to ${mongo_uri}`);
    }
  });
// mongoose.connect("mongodb://localhost/usersdb");
// mongoose.connection.on("error", err => console.log(err))


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors(corsOptions));

app.use(require("./routes"))

app.get('/api/home',(req, res, next) => {
    res.send('Welcome!');
});
app.get('/api/secret', withAuth, function(req, res) {
  res.send('The password is potato');
});

app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});


  // POST route to register a user
app.post('/api/register', function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(function(err) {
        console.log(err)
        if (err) {
            res.status(500)
            .send("Error registering new user please try again.");
        } else {
            res.status(200).send("Welcome to the club!");
        }
    });
});
app.post('/api/authenticate', function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500)
            .json({
            error: 'Internal error please try again'
            });
        } else if (!user) {
            res.status(401)
            .json({
                error: 'Incorrect email or password'
            });
        } else {
            user.isCorrectPassword(password, function(err, same) {
            if (err) {
                res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
            } else if (!same) {
                res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
            } else {
                // Issue token
                const payload = { email };
                const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
                });
                res.cookie('token', token, { httpOnly: true })
                .sendStatus(200);
            }
            });
        }
    });
});
app.listen(port, () => console.log(`Server is listening on port ${port}`))
