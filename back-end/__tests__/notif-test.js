process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const notifSchema = require('../schema/notificationSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const {after} = require('mocha');
const should = chai.should();

chai.use(chaiHttp);

const Notification = mongoose.model("notifSchema", notifSchema);

//Our parent block
describe('Notification', () => {
    let server = require('../server')

    beforeEach((done) => { //Before each test we empty the database
        Notification.remove({}, (err) => { 
           done();           
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
        .send(recepient)
        .end((err,res) => {
            if(err) return done(err);
            res.status.should.be.equal(200);
            res.body.should.be.a('array');
            done();
        })
    })
})
})