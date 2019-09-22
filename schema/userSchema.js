const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    email: String,
    password: String,
    gender: String,
    spouse: String,
    father: String,
    mother: String,
    artefact: [String],
    pictureUrl: String 
});

module.exports = userSchema;