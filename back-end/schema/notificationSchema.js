const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    artefact: { type: Schema.Types.ObjectId, ref: 'Artefact' },
    time: String,
});

module.exports = notificationSchema;