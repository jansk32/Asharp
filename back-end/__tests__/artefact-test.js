process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const artefactSchema = require('../schema/artefactSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const {after} = require('mocha');
const should = chai.should();
// jest.config.js
module.exports = {
  setupTestFrameworkScriptFile: './jest.setup.js'
}

// jest.setup.js
jest.setTimeout(30000)

chai.use(chaiHttp);

const Artefacts = mongoose.model("artefactSchema", artefactSchema);

//Our parent block
describe('Artefacts', () => {
    let server = require('../server')

    beforeEach((done) => { //Before each test we empty the database
        Artefacts.remove({}, (err) => { 
           done();           
        });        
    });

/*
  * Test the /GET route
  */
  describe("Get artefacts", () => {
      it('should successfully retrieve artefacts the user', (done) => {
          let id = "5d8b53d4e53dae0e40d6381b"
          chai.request(server)
            .get('/artefact/' + id)
            .end((err,res) => {
                if (err) return done(err);
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
      let id = "5db673cba14e090c1a3b4bd6";
      let toBeCreated = {
          name: "Batman",
          date: "1973-05-01",
          owner: id,
          value: "The most powerful DC superhero",
          description: "A rich man in a bat suit",
          file: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
      };

      chai.request(server)
      .post('/artefact/create')
      .send(toBeCreated)
      .end((err,res) => {
          if (err) return done(err);
          res.status.should.be.equal(200);
          res.body.should.be.a('object');
          console.log(res.body);
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
    it('should successfully get ONE artefact', async (done) => {

        let id = "5d8b54a1e53dae0e40d6381d";

        let final =  { id: '5d8b54a1e53dae0e40d6381d',
        name: 'Buzz lightyear toy',
        date: '2019-01-01T00:00:00.000Z',
        owner: '5daedf03a7366a1e1a8e74f1',
        value: 'Precious memory',
        description: 'My son\'s favourite toy',
        file: 'https://firebasestorage.googleapis.com/v0/b/mementos-7bca9.appspot.com/o/images%2F1569412102133?alt=media&token=15a94607-91d6-45d2-adb0-2c004ec86acf',
        __v: 0 }

        chai.request(server)
        .get('/artefact/find/' + id)
        .end(async (err,res) => {
            if (err) return done(err);
            await console.log(res.body);
            await res.status.should.be.equal(200);
            await res.body.should.be.a('object');
            await expect(res.body).to.deep.equal(final);
            done();
        })
      })
  })
  
 
  
  describe("Re-assigning artefact", () => {
      it('assign artefact', (done) => {
        let artefact = {
            artefactId: "5db3cb2d6c4501091c7f35b0",
            recipientId: "5daedf03a7366a1e1a8e74f1",
            senderId: "5d8b53d4e53dae0e40d6381b"
        }

        // let expected = {
        // _id: '5d873ac98e26051f13e3073c',
        // name: 'Book',
        // date: '2018-01-01T00:00:00.000Z',
        // owner: '5d92f0247841ae35cc02e64c',
        // value: 'Wjwiwj"',
        // description: 'Bahabsu',
        // file: 'https://firebasestorage.googleapis.com/v0/b/mementos-7bca9.appspot.com/o/images%2F1569143479333?alt=media&token=e0a41d98-7626-4d65-a807-0b7c325e9f2a',
        // __v: 0 
        // }

        chai.request(server)
        .put('/artefact/assign/')
        .send(artefact)
        .end((err, res) => {
            if(err) return done(err);
            res.status.should.be.equal(200);
            res.body.should.be.a('object');
            // expect(res.body.owner).to.be.equal(artefact.recipientId)
            // expect(res.body._id).to.be.equal(artefact.artefactId)
            done();
        })
      })
  })

  describe('Find owner through the artefact', () => {
      it('so first, find an artefact', (done) => {
          let ownerId = "5daedf03a7366a1e1a8e74f1";
          chai.request(server)
          .get("/artefact/findbyowner/" + ownerId)
          .end((err, res) => {
              if(err) return done(err);
              res.status.should.be.equal(200);
              res.body.should.be.a('array')
              done();
          })
      })
  })

  describe('To update an artefact\'s details', () => {
    let id = '5d873ac98e26051f13e3073c';
    let update ={

    };
    it('update an artefact', (done) => {
          chai.request(server)
          .put('/artefact/update/' + id)
          .send(update)
          .end((err, res) => {
              if(err) return done(err);
              res.body.should.be.a('object');
              res.status.should.be.equal(200);
              done();
          })
      })
  })

  describe('To delete an artefact', () => {
      it('To delete an artefact', (done) => {
        let id = "5db24279ec69a40abbc276b8";
        chai.request(server)
        .delete('/artefact/delete/' + id)
        .end((err,res) => {
            if(err) return done(err);
            res.status.should.be.equal(200);
            res.body.should.be.a('object');
            done();
        })
      })
  })

});