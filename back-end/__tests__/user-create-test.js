process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const { expect, assert } = require("chai");
const chaiHttp = require('chai-http');
const { after } = require('mocha');
const should = chai.should();
// jest.config.js
module.exports = {
    setupTestFrameworkScriptFile: './jest.setup.js'
}

// jest.setup.js
jest.setTimeout(30000)

chai.use(chaiHttp);

const User = mongoose.model("userSchema", userSchema);

describe('User', () => {
    let server = require('../server')
    var createdUser = null;

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    describe('Create a user', () => {
        it('Should successfully create a new user', async () => {
            let signUp = {
                name: "Bruce",
                dob: "2019-01-01T00:00:00.000Z",
                email: 'anto@gmail.com',
                password: '1234',
                gender: 'm',
                spouse: null,
                father: null,
                mother: null,
                pictureUrl: "https://i.imgur.com/QKsSRsu.jpg",
                isUser: 'true'
            };
           await chai.request(server)
                .post('/user/create')
                .send(signUp)
                .end((err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    done();
                })
        })
    })
})