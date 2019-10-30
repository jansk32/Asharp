process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const { expect, assert } = require("chai");
const chaiHttp = require('chai-http');
const { after } = require('mocha');
const should = chai.should();

chai.use(chaiHttp);

let server = require('../server');
const User = mongoose.model("UserTest", userSchema);

describe('Update a profile', () => {
    let createdUser;
    beforeAll(async () => {
        let orang2 = {
            name: "Orang",
            dob: (new Date()).toISOString(),
            gender: 'm',
            isUser: true,
        }
        createdUser = await new User(orang2).save();
        return createdUser;
    })
    // Remove test database
    afterAll(() => {
        return User.remove({});
    })

    it('Update a user', (done) => {
        var loginUserId = createdUser._id;
        let updated = {
            name: "Joey Tribiani",
            dob: (new Date()).toISOString(),
            pictureUrl: "https://i.pinimg.com/736x/0f/55/e5/0f55e5e6ee16e32760bd0b4c536478b5.jpg",
            password: "123456"
        }

        chai.request(server)
            .put('/user/update/' + loginUserId)
            .send(updated)
            .then((res) => {
                // if (err) return done(err);
                res.status.should.be.equal(200);
                return User.findById(loginUserId);
            }).then((user) => {
                expect(user.name).to.equal(updated.name);
                expect(user.dob.toISOString()).to.equal(updated.dob);
                expect(user.pictureUrl).to.equal(updated.pictureUrl);
                done();
            });
    })
})