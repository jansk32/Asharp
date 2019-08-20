const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    children: [String],
    artefact: [String] 
});

module.exports = userSchema;