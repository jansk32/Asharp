const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

app.get('/', (req, res) => {
    res.send("Hello World");
})

// get a user
app.get('/user', (req, res) => {
    // change later
    userModel.find(req.body, (err, resp) => {
        if (err) throw err;
        res.json(resp);
    });
})

// create a user
app.post("/user/create", (req,res) => {
    let user = userModel({
        name: req.body.name,
        dob: req.body.dob,
        userName: req.body.userName,
        password: req.body.password,
        children: req.body.children,
        artefact: req.body.artefact 
    });

    user.save((err,resp) => {
        if(err) throw err;
        res.send(resp);
    })
})

// get an artefact
app.get('/artefact', (req, res) => {
    artefactModel.find(req.body, (err,resp) => {
        if (err) throw err;
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

app.listen(port);
console.log("Listening to port " + port);

module.exports = app;