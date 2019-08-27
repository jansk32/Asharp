const mongoose = require('mongoose');
const schema = require('../schema/userSchema');

// creates the mongoose model 
var userModel = mongoose.model('user', schema);

// retrieve user
exports.getUser = (obj) => userModel.findOne(obj, (err, resp) => {
    if(err) throw err;
    return resp;
});

// create a user 
exports.createUser = (obj) => {
    var test = new userModel(obj);
    test.save((err,resp) => {
    if(err) throw err;
    console.log("Saved");
})
}

