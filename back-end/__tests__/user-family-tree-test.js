process.env.NODE_ENV = 'test';

const { DB_ENDPOINT } = require('../server-constants');
const server = require("../server");
const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model('UserTest', userSchema);


describe('Family Tree', () => {
    let dummy = {
        father: undefined,
        mother: undefined,
        child: undefined,
        realChild: undefined,
        realChild2: undefined,
    }
    require('../controller/mongooseController');

    // make ur orang2 before doing all the tests :) jansen
    beforeAll(() => {
        let orang2 = [{
            name: "Orang",
            dob: (new Date()).toISOString(),
            gender: 'm',
            isUser: true,
        },
        {
            name: "Istri Orang",
            dob: (new Date()).toISOString(),
            gender: 'f',
            isUser: true,
        },
        {
            name: "Anak Orang",
            dob: (new Date()).toISOString(),
            gender: 'f',
            isUser: false
        },
        {
            name: "Bukan Adopsi",
            dob: (new Date()).toISOString(),
            gender: 'f',
            isUser: false,

        }, {
            name: "SIAPA COBA HAYO",
            dob: (new Date()).toISOString(),
            gender: 'm',
            isUser: true
        }].map((x) => {
            return new User(x).save();
        });
        // makes orang2
        return Promise.all(orang2).then((listOrang) => {
            
            dummy.father = listOrang[0];
            dummy.mother = listOrang[1];
            dummy.child = listOrang[2];
            dummy.realChild = listOrang[3];
            dummy.realChild2 = listOrang[4];
            
            return dummy;
        });
    });

    afterAll(() => {
        return User.remove({}).then(() => 0);
    });

    describe('Get users for family tree', () => {
        /// ini gaada.
        // it('Get users by name', (done) => {
        //     chai.request(server)
        //     .get("/user/search")
        //     .send({name: "Orang"})
        //     .end((err, res) => {
        //         if(err) return done(err);
        //         res.status.should.be.equal(200);
        //         expect(res.body).to.be.a('array');
        //         done();
        //     })
        // })
    })

    describe("Add a spouse", () => {
        it("Adding manually", (done) => {
            let parent = {
                personId: dummy.father._id,
                spouseId: dummy.mother._id,
            }
            chai.request(server)
            .put("/user/add-spouse")
            .send(parent)
            .then((res) => {
                done();
                res.status.should.be.equal(200);

                return User.findById(parent.personId);
            }).then((person) => {
                expect(person.spouse).to.equal(parent.spouseId.toString());
            });
            // })
            // .end((err, res) => {
            //     if (err) {
            //         throw done(err);
            //     }
            //     res.status.should.be.equal(200);
                
            //     done();
            // });

        })

        it("Add parent to someone with a spouse", (done) => {
            let sending = {
                childId: dummy.child._id,
                parentId: dummy.mother._id,
            }

            chai.request(server)
            .put("/user/add-parent/")
            .send(sending)
            .end((err, res) => {
                if(err) {
                    throw done(err)
                };
                res.status.should.be.equal(200);
                done();
            })
        })

        it("Adding new parents manually",(done) => {
            let parent = {
                personId: dummy.realChild2._id,
                fatherName: dummy.father.name, 
                fatherDob: dummy.father.dob, 
                motherName: dummy.mother.name,
                motherDob: dummy.mother.dob,
            }

            chai.request(server)
            .post("/user/add-parents-manually/")
            .send(parent)
            .end((err, res) => {
                if (err) return done(err);
                res.status.should.be.equal(200);
                done();
            });

        })

        it("Adding child manually", (done) => {
            let child = {
                personId: dummy.mother._id,
                childId: dummy.realChild._id,
            }

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