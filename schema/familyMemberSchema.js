const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    gender: String,
    spouse: String,
    father: String,
    mother: String,
    pictureUrl: String 
});

module.exports = familyMemberSchema;