const mongoose = require('mongoose');

// schema for artefact
const artefactSchema = new mongoose.Schema({
    name: String,
    date: Date,
    owner: String,
    value: String,
    description: String,
    file: String
});

module.exports = artefactSchema;