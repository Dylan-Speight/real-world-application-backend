const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const express = require("express")

const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware/auth');

const cors = require('cors');
const User = require('./models/user.js');
const Investment = require('./models/investment_model.js')

const corsOptions = {
    origin: 'http://localhost:3000'
}
const secret = 'mysecretsshhh';

const app = express()
const port = 4000


app.use(cors(corsOptions));
app.use(cookieParser());
const mongo_uri = "mongodb://127.0.0.1/usersdb"
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
    res.sendStatus(200);
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
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
        if (err) {
            res.status(500)
            .json({
            error: 'Internal error please try again'
            });
        } else if (!user) {
            res.status(401)
            .json({
                error: {email: 'Incorrect Email Address'}
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
                    error: {password: 'Incorrect Password'}
                });
            } else {
                const payload = { email };
                const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
                })
                res.status(200).json({'token': token})
            }
            });
        }
    });
});

app.post('/api/saveinvestment', function(req, res) {
    const investment = req.body;
    let newInvestment = new Investment( investment );
    newInvestment.save(function(err) {
        if (err) {
            res.status(500).json({error:"Error saving investment please try again."});
        } else {
            res.status(200).send("Investment successfully added to profile");
        }
    })
});

app.post('/api/findinvestment', function(req, res) {
    const email = req.headers.authorization;
    Investment.find( {userid: email }, function(err, investment) {
        if (err) {
            res.status(500).json("User doesn't have any investments")
        }
        else {
            res.status(200).json(investment)
        }
    })
})

app.post('/api/removeinvestment', function(req, res) {
    const investment = req.body.propertyid;
    Investment.findOneAndDelete({propertyid:investment.investment.propertyid, userid: investment.email}, function(err, investment) {
        if (investment) {
            console.log(investment)
        }
        if (err){
            console.log("error")
            res.status(500).json({error:"Error removing investment please try again."});
        } else {
            res.status(200)
        }
    })
})

app.listen(port, () => console.log(`Server is listening on port ${port}`))
