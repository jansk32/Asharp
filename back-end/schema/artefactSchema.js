const mongoose = require('mongoose');

const artefactSchema = new mongoose.Schema({
    name: String,
    date: Date,
    owner: String,
    description: String,
    value: String,
    file: String
});

module.exports = artefactSchema;