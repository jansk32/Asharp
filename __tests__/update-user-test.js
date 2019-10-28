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


    

describe('Update a profile', () => {
        let server = require('../server');
        
            it('Update a user', (done) => {
                var loginUserId = "5db3cbaad08026093bf70ecc";
                let updated = {
                    name: "Joey Tribiani",
                    dob: "1990-04-02",
                    pictureUrl: "https://i.pinimg.com/736x/0f/55/e5/0f55e5e6ee16e32760bd0b4c536478b5.jpg",
                    password: "123456"
                }

                chai.request(server)
                .put('/user/update/' + loginUserId)
                .send(updated)
                .end((err, res) => {
                    if(err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('object');
                    expect(res.body.name).to.be.equal(updated.name);
                    expect(res.body.pictureUrl).to.be.equal(updated.pictureUrl);
                    done();
                })
            })
        })