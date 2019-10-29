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
        server = require("../server");
        User.remove({}, (err) => { 
            done();           
         }); 
         
    })
    afterEach(() => {
        mongoose.connection.close();
    })
    

    describe("Add a spouse", () => {
        
        let parent = {
            personId:"5db3eafd773ed40c426b905d",
            spouseId: "5db6721171558a0bb439bc82", 
        }

        it("Adding manually", async (done) => {
            console.log("hlllo");
            chai.request(server)
            .put("user/add-spouse")
            .send(parent)
            .end((err, res) => {
                // if(err) return done(err);
                console.log(res);
                console.log(err)
                done();
            })
        })
    })
})