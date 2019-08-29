const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// user schema
const schema = require('../schema/userSchema');

// creates the mongoose model 
var userModel = mongoose.model('user', schema);

// to connect to mongodb
require("../controller/mongooseController");

// app.use
app.use(bodyParser.json({type: "application/json"}));


const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send("Hello World");
})

app.get('/user', (req,res) => {
    userModel.find({name:"Jansen"}, (err,resp) => {
        if(err) throw err;
        res.send(resp);
   });
})

app.get('/artefact', (req,res) => {
    res.send("artefact");
})

app.listen(port);
console.log("Listening to port "+ port);

module.exports = app;