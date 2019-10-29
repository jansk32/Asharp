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

    // after(() => {
    //     mongoose.connection.close();
    // })

    describe('Get users for family tree', () => {
        it('Get users by name', async () => {
            chai.request(server)
            .get("/user/search/")
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
            personId: "5db7a00637ec9270aecdecc4",
            spouseId: "5db7bc13ce456711c0044e2c", 
        }

        it("Adding manually", async (done) => {
            let server = require("../server");
            chai.request(server)
            .put("/user/add-spouse")
            .send(parent)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw done(err);
                }
                res.status.should.be.equal(200);
                done();
            })

        })
    })

    describe("Add parent who already has a spouse", () => {
        let sending ={
            childId: "5db7b3554dfc8372ac55473d",
            parentId: "5db7b0a2c048620f97b048df"
        }

        it("Add parent to someone with a spouse", async () => {
            await chai.request(server)
            .put("/user/add-parent/")
            .send(sending)
            .end((err, res) => {
                if(err) {
                    console.log(err);
                    throw done(err)
                };
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
        it("Adding manually", async () => {
            await chai.request(server)
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
            personId:"5db7b53cb74af87369a9a5f6",
            childId: "5db7b69741cfa373edc11f95"
        }
        it("Adding manually", async () => {
            await chai.request(server)
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