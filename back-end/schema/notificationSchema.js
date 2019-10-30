const mongoose = require('mongoose');
const UserTable = process.env.NODE_ENV == 'test' ? 'UserTest' : 'User';
const ArtefactTable = process.env.NODE_ENV == 'test' ? 'ArtefactTest' : 'Artefact';
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: UserTable },
    recipient: { type: Schema.Types.ObjectId, ref: UserTable },
    artefact: { type: Schema.Types.ObjectId, ref: ArtefactTable },
    time: String,
});

module.exports = notificationSchema;