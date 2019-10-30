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
    let server = require('../server')
    let createdUser = undefined;

    beforeAll(async () => {
        let person = {
            name: "Orang",
            dob: (new Date()).toISOString(),
            gender: 'm',
            isUser: true,
            pictureUrl: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
        }
        createdUser = await new User(person).save();

    })
    

    afterAll(() => { //Before each test we empty the database
        return User.remove({}).then(() => {
            return mongoose.connection.close();
        });
    });

    describe('Find a user', () => {
        it('Find a user by id', (done) => {
            let id = createdUser._id;
            chai.request(server)
                .get('/user/find/' + id)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.a('object');
                    expect(res.body).to.have.property("name");
                    expect(res.body).to.have.property("dob");
                    expect(res.body).to.have.property("pictureUrl");
                    done();
                })
        })
    })

    describe('Get all the current users', () => {
        it('Get all users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
    })



})