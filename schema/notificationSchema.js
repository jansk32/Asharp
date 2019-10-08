const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderId: String,
    artefactId: String,
    time: String,
});

module.exports = notificationSchema;