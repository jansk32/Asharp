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


    describe('Create a user', () => {
        it('Should successfully create a new user', (done) => {
            let signUp = {
                _method: 'post',
                name: "Sam",
                dob: "1900-01-01",
                pictureUrl: "https://i.imgur.com/QKsSRsu.jpg",
                email: '5@5',
                password: '1234',
                gender: 'm',
                isUser: 'true'
            };
            chai.request(server)
            .post('/user/create')
            .send(signUp)
            .end((err, res) => {
                if(err) return done(err);
                res.status.should.be.equal(200);
                done();
            })
        })
    })

    describe('Find a user', () => {
        it('Find a user by id, without revealing password or email', done => {
            let id = "5d92f2247841ae35cc02e64d";
            chai.request(server)
            .get('/user/find/' + id)
            .end((err,res) => {
                if(err) return done(err);
                res.body.should.be.a('object');
                console.log(res.body);
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("dob");
                expect(res.body).to.have.property("pictureUrl");
                // res.body.should.have.property('name');
                // res.body.should.have.property('dob');
                // res.body.should.have.property('pictureUrl');
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