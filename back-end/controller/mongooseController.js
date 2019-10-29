const { DB_ENDPOINT } = require('../server-constants');

const mongoose = require('mongoose');

const connectMongo = mongoose.connect(DB_ENDPOINT,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

module.exports = connectMongo;