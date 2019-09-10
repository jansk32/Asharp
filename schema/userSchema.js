const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    email: String,
    userName: String,
    password: String,
    gender: String,
    spouse: String,
    father: String,
    mother: String,
    artefact: [String],
    picture: String 
});

module.exports = userSchema;