process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const notifSchema = require('../schema/notificationSchema');
const userSchema = require('../schema/userSchema');
const artefactSchema = require('../schema/artefactSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const {after} = require('mocha');
const should = chai.should();

chai.use(chaiHttp);

const Notification = mongoose.model("NotifTest", notifSchema);
const User = mongoose.model("UserTest", userSchema);
const Artefact = mongoose.model("ArtefactTest", artefactSchema);


//Our parent block
describe('Notification', () => {
    let server = require('../server')
    let user;
    let notification;
    let artefact;

    beforeEach(() => { //Before each test we empty the database
        return new User({
            name: "wek",
            email: "wek@wek.com",
            password: "wekwekwek",
            dob: new Date().toISOString(),
            pictureUrl: "ioasdjoiasd",
            gender: 'f',
            isUser: true
        }).save().then((newuser) => {
            user = newuser;
            return new Artefact({
                name: 'bagong2',
                date: (new Date()).toISOString(),
                owner: user._id,
                description: "beego2",
                value: "bebebbe2",
                file: "hh"
            }).save();
        }).then((art) => {
            return new Notification({
                sender: user._id,
                recepient: user._id,
                artefact: art._id,
            }).save();
        });
    });

    describe('test notification', () => {
        it('Notification should be successful', (done) => {
        let recepient = {
            sender: '5d830f1d1d53660595bedb52',
            recepient: '5d92f2247841ae35cc02e64d',
            artefact: '5d9d1bd407d9f43b5c128c33',
            time: "2030-10-08T23:56:40.011Z" 
        }
        
        chai.request(server)
        .get('/notification/')
        .query({ recepient: user._id })
        .send(recepient)
        .end((err,res) => {
            if(err) return done(err);
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a('array');
            done();
        })
    })
})
})