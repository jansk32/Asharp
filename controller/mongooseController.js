const mongoose = require('mongoose');

const connectMongo = mongoose.connect("mongodb://jkwo:goblox123@ds263917.mlab.com:63917/asharp",
{useNewUrlParser: true});

module.exports = connectMongo;