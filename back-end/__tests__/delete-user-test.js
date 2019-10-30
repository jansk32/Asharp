process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const { expect, assert } = require("chai");
const chaiHttp = require('chai-http');
const { after } = require('mocha');
const should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model("UserTest", userSchema);


describe('User', () => {
    let server = require('../server');
    // Create dummy user
    let createdUser;
    beforeAll(async () => {
        let orang2 = {
            name: "Orang",
            dob: (new Date()).toISOString(),
            gender: 'm',
            isUser: true,
        }
        createdUser = await new User(orang2).save();
    })
    // Remove test database
    afterAll(() => {
        return User.remove({});
    })
    it('Should delete a user', (done) => {
        let id = createdUser._id;
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