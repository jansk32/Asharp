const express = require('express');
const app = express();

require("../controller/mongooseController");

const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send("Hello World");
})

app.listen(port);