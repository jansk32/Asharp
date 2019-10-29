const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    email: String,
    password: String,
    gender: String,
    spouse: String,
    father: String,
    mother: String,
    pictureUrl: String,
    isUser: Boolean,
});

module.exports = userSchema;