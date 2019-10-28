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
    let server = require('../server')
    var createdUser = null;

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });
    
describe('Create a user',  () => {
    afterAll(() => {
        mongoose.connection.close();
    })
        it('Should successfully create a new user', async (done) => {
            let signUp = {
                name: "Bruce",
                dob: "1900-01-01",
                pictureUrl: "https://i.imgur.com/QKsSRsu.jpg",
                email: '5@5',
                password: '1234',
                gender: 'm',
                isUser: 'true'
            };
            await chai.request(server)
            .post('/user/create')
            .send(signUp)
            .end((err, res) => {
                if(err) return done(err);
                res.status.should.be.equal(200);
                done();
            })
        })
    })
})