const mongoose = require("mongoose");
const express = require("express")
// var session = require('express-session');

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


app.use(cors(corsOptions));
app.use(cookieParser());
// app.use(session({
//     secret: secret,
//     cookie: {
//         path: '/',
//         domain: 'localhost:3000',
//         maxAge: 1000 * 60 * 24 // 24 hours
//     }
// }));
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     next();
// });
const mongo_uri = "mongodb://localhost/usersdb"
mongoose.connect(mongo_uri, function(err) {
    if (err) {
      throw err;
    } else {
      console.log(`Successfully connected to ${mongo_uri}`);
    }
  });

  app.options('*', cors());

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
    res.status(200).send("yes")
    // res.sendStatus(200);
});


  // POST route to register a user
app.post('/api/register', function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(function(err) {
        if (err) {
            res.status(500).json({error:"Error registering new user please try again."});
        } else {
            res.status(200).send("Welcome to the club!");
        }
    });
});


app.post('/api/authenticate', function(req, res) {
    // console.log(req.body)
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
        if (err) {
            console.log("user doesn't exist")

            console.error(err);
            res.status(500)
            .json({
            error: 'Internal error please try again'
            });
        } else if (!user) {
            console.log("Wrong deets")

            res.status(401)
            .json({
                error: 'Incorrect email or password'
            });
        } else {
            user.isCorrectPassword(password, function(err, same) {
                console.log("CorrectPass")
            if (err) {
                res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
            } else if (!same) {
                console.log("typo somewhere")

                res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
            } else {
                console.log("token issued")
                const payload = { email };
                const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
                })
                console.log(token)
                res.status(200).json({'token': token})
            }
            });
        }
    });
});
app.listen(port, () => console.log(`Server is listening on port ${port}`))
