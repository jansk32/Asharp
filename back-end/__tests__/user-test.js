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

    afterAll(() => {
        mongoose.connection.close();
    })

    describe('Find a user', () => {
        it('Find a user by id', done => {
            let id = "5db3d1d6631e4e2b387a97ed";
            chai.request(server)
            .get('/user/find/' + id)
            .end((err,res) => {
                if(err) return done(err);
                res.body.should.be.a('object');
                console.log(res.body);
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
                if(err) return done(err);
                res.status.should.be.equal(200);
                res.body.should.be.a('array');
                done();
            })
        })
    })



})