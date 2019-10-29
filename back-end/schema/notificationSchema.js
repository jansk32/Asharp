const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'user' },
    recipient: { type: Schema.Types.ObjectId, ref: 'user' },
    artefact: { type: Schema.Types.ObjectId, ref: 'artefact' },
    time: String,
});

module.exports = notificationSchema;