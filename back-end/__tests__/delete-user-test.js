process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const {after} = require('mocha');
const should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model("userSchema", userSchema);


describe('User', () => {
    let server = require('../server');

    it('Should delete a user', () => {
            let id = "5db58b5b776f7f17e4802269";
            chai.request(server)
            .delete('/user/delete/' + id)
            .end((err, resp) => {
                if (err) return done(err);
                resp.status.should.be.equal(200);
                resp.body.should.be.a('object');
                done();
    })


})
})