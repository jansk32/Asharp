const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// passport local config
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, found) {
        if (err) { return done(err); }
        // if no username found
        if (!found) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        if (!found.validPassword(password)) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
      });
    }
  ));

// passport Facebook config
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// schemas
const userSchema = require('../schema/userSchema');
const artSchema = require('../schema/artefactSchema');

// creates the mongoose model 
var userModel = mongoose.model('user', userSchema);
var artefactModel = mongoose.model('artefact', artSchema);

// to connect to mongodb
require("../controller/mongooseController");

// app.use
app.use(bodyParser.json({ type: "application/json" }));


const port = process.env.PORT || 3000;

// need to change this later not sure to what though
// '/' should be the home page 
app.get('/', (req, res) => {
    res.send("Hello World");
})

// get a user
app.get('/user', (req, res) => {
    // change later
    userModel.find({name: "Jansen"}, (err, resp) => {
        if (err) throw err;
        res.json(resp[0]);
    });
})

// create a user
app.post("/user/create", (req,res) => {
    
    let user = userModel({
        name: req.body.name,
        dob: req.body.dob,
        email:req.body.email,
        userName: req.body.userName,
        password: req.body.password,
        gender: req.body.gender,
        spouse: req.body.spouse,
        father: req.body.father,
        mother: req.body.mother,
        artefact: req.body.artefact,
        picture: req.body.picture 
    });

    user.save((err,resp) => {
        if(err) throw err;
        res.send(resp);
    })
})

// get an artefact
app.get('/artefact', (req, res) => {
    console.log(req);
    artefactModel.find(req.body, (err,resp) => {
        if (err) throw err;
        console.log(req);
        res.json(resp);
    })
})

// create an artefact
app.post("/artefact/create", (req,res) => {
    let artefact = artefactModel({
        name: req.body.name,
        date: req.body.date,
        owner: req.body.owner,
        value: req.body.value,
        description: req.body.description,
        file: req.body.file
    });

    artefact.save((err,resp) => {
        if(err) throw err;
        res.send(resp);
    })
})

// assign artefact to a person
app.put("/user/assign/:id", (req,res) => {
    userModel.update({id: req.params.id}, {$push: {artefact: req.body}}, (err, resp) => {
        if(err) throw err;
        res.send("updated");
    })
});

// multiple page sign up
// not very good practice tbh 
var newUser = {};

// first page
app.post('/user/create/1', (req,res) => {
    newUser.email = req.body.email;
})

// second page
app.post('/user/create/2', (req,res) => {
    newUser.name = req.body.firstName + req.body.lastName;
    newUser.dob = req.body.dob;
    newUser.userName = req.body.userName;
    newUser.password = req.body.password;
})

// third page
app.post('/user/create/3', (req,res) => {
    newUser.picture = req.body.file;
    console.log(newUser);
    let newUserModel = new userModel(newUser);
    newUserModel.save((err, resp) => {
        if(err) throw err;
    })
})

// login page
app.get('/login', (req,res) => {

});

// login local
app.post('/login/local', passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login' }));

//login Facebook
app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.listen(port);
console.log("Listening to port " + port);

module.exports = app;