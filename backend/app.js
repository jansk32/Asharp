const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// route for artefact
const userRoute = require('../routes/userRoute');

// to connect to mongodb
require("../controller/mongooseController");

// app.use
app.use(bodyParser.json());


const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send("Hello World");
})

app.get('/user', (req,res) => {
   userRoute.getUser({name: 'Jansen'});
})

app.get('/artefact', (req,res) => {
    res.send("artefact");
})

app.listen(port);
console.log("Listening to port "+ port);

module.exports = app;