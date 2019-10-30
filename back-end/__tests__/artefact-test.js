process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const artefactSchema = require('../schema/artefactSchema');
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const { expect, assert } = require("chai");
const chaiHttp = require('chai-http');
const { after } = require('mocha');
const should = chai.should();
let server = require('../server');
// jest.config.js
module.exports = {
    setupTestFrameworkScriptFile: './jest.setup.js'
}

// jest.setup.js
jest.setTimeout(30000)

chai.use(chaiHttp);
const User = mongoose.model("UserTest", userSchema);
const Artefacts = mongoose.model("ArtefactTest", artefactSchema);

//Our parent block
describe('Artefacts', () => {
    // People dummy data
    let dummyPerson = {
        person1: undefined,
        person2: undefined,
    };
    // Artefact dummy data
    let dummy = {
        artefact1: undefined,
        artefact2: undefined,
    };
    
    // Do this before testing all
    beforeAll(async () => {

        // Create a dummy of people
        let people = [{
            name: "Orang",
            dob: (new Date()).toISOString(),
            gender: 'm',
            isUser: true,
            pictureUrl: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
        },
        {
            name: "Orang2",
            dob: (new Date()).toISOString(),
            gender: 'f',
            isUser: true,
            pictureUrl: "meng"
        }].map((x) => {
            return new User(x).save();
        })

        // Return as promise to be use in tests
        await Promise.all(people).then((listPerson) => {
            dummyPerson.person1 = listPerson[0];
            dummyPerson.person2 = listPerson[1];
        });
        // Fake artefacts for testing
        let artefactArr = [{
            name: 'bagong',
            date: (new Date()).toISOString(),
            owner: dummyPerson.person1._id,
            description: "beego",
            value: "bebebbe",
            file: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png",
        },
        {
            name: 'bagong2',
            date: (new Date()).toISOString(),
            owner: dummyPerson.person2._id,
            description: "beego2",
            value: "bebebbe2",
            file: "hh"
        }].map((x) => {
            return new Artefacts(x).save();
        });
        // Return as promise to be use in tests
        return Promise.all(artefactArr).then((listArt) => {
            dummy.artefact1 = listArt[0];
            dummy.artefact2 = listArt[1];
            return listArt;
        });
    })
    //After each test we empty the database
    afterAll(() => {
        return Promise.all([Artefacts, User].map(x => x.remove({})))
            .then(() => 0);
    });

    /*
      * Test the /GET route
      */
    describe("Get artefacts", () => {
        it('should successfully retrieve artefacts of the user', (done) => {
            let id = dummyPerson.person1._id;
            chai.request(server)
                .get('/artefact/' + id.toString())
                .then((res) => {
                    // if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('array');
                    // console.log(res.body);
                    done();
                })
        })
    })

    describe('To create an artefact', () => {

        it('/user/create', (done) => {
            // look into sinon and stubs
            let userId = dummyPerson.person1._id;
            let toBeCreated = {
                name: "Batman",
                date: "1973-05-01",
                owner: userId,
                value: "The most powerful DC superhero",
                description: "A rich man in a bat suit",
                file: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
            };

            chai.request(server)
                .post('/artefact/create')
                .send(toBeCreated)
                .end((err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('object');
                    sampleArtefact = res.body;
                    res.body.should.have.property("_id");
                    res.body.should.have.property("name");
                    res.body.should.have.property("owner");
                    res.body.should.have.property("value");
                    res.body.should.have.property("description");
                    res.body.should.have.property("file");
                    res.body.should.have.property("date");
                    done();
                })
        })
    })


    describe('Getting one artefact', () => {
        it('should successfully get ONE artefact', (done) => {
            let final = {
                _id: '5db71b85f17c6e1aa4338d50',
                name: 'Pacman cake',
                date: '2016-10-28T13:00:00.000Z',
                owner: '5db6d8c3af805314aceb4db8',
                value: 'Bb',
                description: 'Aa',
                file: 'https://firebasestorage.googleapis.com/v0/b/mementos-7bca9.appspot.com/o/images%2F1572281216407?alt=media&token=622950a1-62db-4138-b44e-3128ab62b8a7',
                __v: 0
            }

            chai.request(server)
                .get('/artefact/find/' + dummy.artefact2._id)
                .end(async (err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('object');
                    expect(res.body.name).to.equal(dummy.artefact2.name);
                    expect(res.body.owner).to.equal(dummy.artefact2.owner);
                    expect(res.body.description).to.equal(dummy.artefact2.description);
                    expect(res.body.value).to.equal(dummy.artefact2.value);
                    expect(res.body.file).to.equal(dummy.artefact2.file);
                    done();
                })
        })
    })



    describe("Re-assigning artefact", () => {
        it('assign artefact', (done) => {
            let artefact = {
                artefactId: dummy.artefact1._id,
                recipientId: dummyPerson.person1._id,
                senderId: dummyPerson.person2._id,
            }
            chai.request(server)
                .put('/artefact/assign/')
                .send(artefact)
                .end((err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('object');
                    expect(res.body.owner).to.be.equal(artefact.recipientId.toString())
                    expect(res.body._id).to.be.equal(artefact.artefactId.toString())
                    done();
                })
        })
    })

    describe('Find owner through the artefact', () => {
        it('so first, find an artefact', (done) => {
            let ownerId = dummyPerson.person2._id;
            chai.request(server)
                .get("/artefact/findbyowner/" + ownerId.toString())
                .end((err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('array')
                    done();
                })
        })
    })

    describe('To update an artefact\'s details', () => {


        it('update an artefact', (done) => {
            let id = dummy.artefact1._id;
            let update = {
                name: 'bagong2',
                description: "beego2",
                value: "bebebbe2",
                file: "hh"   
            };
            chai.request(server)
                .put('/artefact/update/' + id)
                .send(update)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.should.be.a('object');
                    expect(res.body.name).to.equal("bagong2");
                    expect(res.body.description).to.equal("beego2");
                    expect(res.body.value).to.equal("bebebbe2");
                    res.status.should.be.equal(200);
                    done();
                })
        })
    })

    describe('To delete an artefact', () => {
        it('To delete an artefact', (done) => {
            let id = dummy.artefact1._id;
            chai.request(server)
                .delete('/artefact/delete/' + id)
                .end((err, res) => {
                    if (err) return done(err);
                    res.status.should.be.equal(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })

});