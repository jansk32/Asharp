const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    userName: String,
    password: String,
    children: [String],
    artefact: [String] 
});

module.exports = userSchema;