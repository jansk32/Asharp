process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const {before, after} = require('mocha');
const should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model("userSchema", userSchema);


describe('Family Tree', () => {
    let server = require("../server");

    beforeEach((done) => {
        User.remove({}, (err) => { 
            done();           
         });      
    })

    afterEach(() => {
        mongoose.connection.close();
    })

    describe('Get users for family tree', () => {
        it('Get users by name', (done) => {
            chai.request(server)
            .get("/user/search")
            .send({name: "Sam"})
            .end((err, res) => {
                if(err) return done(err);
                res.status.should.be.equal(200);
                expect(res.body).to.be.a('array');
                done();
            })
        })
    })

    describe("Add a spouse", () => {
        let parent = {
            personId:"5db3eafd773ed40c426b905d",
            spouseId: "5db6721171558a0bb439bc82", 
        }

        it("Adding manually", (done) => {
            chai.request(server)
            .put("/user/add-spouse/")
            .send(parent)
            .end((err, res) => {
                // if (err) return done(err);
                res.status.should.be.equal(200);
                done();
            })

        })
    })

    describe("Add parent who already has a spouse", () => {
        let sending ={
            childId: "5db3eafd773ed40c426b905d",
            parentId: "5db6717cfc067b0b90258c2a"
        }

        it("Add parent to someone with a spouse", (done) => {
            chai.request(server)
            .put("/user/add-parent/")
            .send(sending)
            .end((err, res) => {
                if(err) throw done(err);
                res.status.should.be.equal(200);
                done();
            })
        })
    })

    describe("Add a parent", () => {
        let parent = {
            personId:"5db681c5f0c9670e288908d0",
            fatherName: "DaddySam", 
            fatherDob: "1900-09-01", 
            motherName: "MommySam",
            motherDob: "1900-09-01"

        }
        it("Adding manually", (done) => {
            chai.request(server)
            .post("/user/add-parents-manually/")
            .send(parent)
            .end((err, res) => {
                if (err) return done(err);
                res.status.should.be.equal(200);
                done();
            })

        })
    })
    
    describe("Add a child", () => {
        let child = {
            personId:"5db3eafd773ed40c426b905d",
            childId: "5db681485181640e19212408"
        }
        it("Adding manually", (done) => {
            chai.request(server)
            .put("/user/add-child/")
            .send(child)
            .end((err, res) => {
                if (err) return done(err);
                res.status.should.be.equal(200);
                done();
            })

        })
    })

})