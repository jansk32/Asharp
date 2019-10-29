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
      it('should successfully retrieve artefacts of the user', (done) => {
          let id = "5db7f48d7d061f0017dfc4fc"
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

        let id = "5db71b85f17c6e1aa4338d50";

        let final =   { _id: '5db71b85f17c6e1aa4338d50',
        name: 'Pacman cake',
        date: '2016-10-28T13:00:00.000Z',
        owner: '5db6d8c3af805314aceb4db8',
        value: 'Bb',
        description: 'Aa',
        file: 'https://firebasestorage.googleapis.com/v0/b/mementos-7bca9.appspot.com/o/images%2F1572281216407?alt=media&token=622950a1-62db-4138-b44e-3128ab62b8a7',
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
            artefactId: "5db7eb0c7d061f0017dfc4f5",
            recipientId: "5db3d1d6631e4e2b387a97ed",
            senderId: "5db6d8c3af805314aceb4db8"
        }

        chai.request(server)
        .put('/artefact/assign/')
        .send(artefact)
        .end((err, res) => {
            if(err) return done(err);
            res.status.should.be.equal(200);
            res.body.should.be.a('object');
            expect(res.body.owner).to.be.equal(artefact.recipientId)
            expect(res.body._id).to.be.equal(artefact.artefactId)
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