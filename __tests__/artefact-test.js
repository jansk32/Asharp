process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const artefactSchema = require('../schema/artefactSchema');
const chai = require('chai');
const {expect, assert} = require("chai");
const chaiHttp = require('chai-http');
const {after} = require('mocha');
const should = chai.should();

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

          chai.request(server)
            .get('/artefact')
            .end((err,res) => {
                if (err) return done(err);
                res.status.should.be.equal(200);
                res.body.should.be.a('array');
                // console.log(res.body);
              done();
            })
      })

      
  })

//   describe('To create an artefact', () => {
//     var user = null;
//     var sampleArtefact = null;

//     it("login first", (done) => {
//       let loginDeets = {
//           email: "fifikwong70@yahoo.com",
//           password: "123456"
//         };

//         chai.request(server)
//           .post('/login/local')
//           .send(loginDeets)
//           .end((err,res) => {
//               res.body.should.be.a('object');
//               user = res.body;
//               res.body.should.have.property('name');
//               res.body.should.have.property('dob');
//               res.body.should.have.property('pictureUrl');
//             done();
//           })
//     })

//     it('/user/create', (done) => {
//         // look into sinon and stubs
//       let toBeCreated = {
//           name: "Batman",
//           date: "1973-05-01",
//           owner: user._id,
//           value: "The most powerful DC superhero",
//           description: "A rich man in a bat suit",
//           file: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
//       };

//       chai.request(server)
//       .post('/artefact/create')
//       .send(toBeCreated)
//       .end((err,res) => {
//           if (err) return done(err);
//           res.status.should.be.equal(200);
//           res.body.should.be.a('object');
//           console.log(res.body);
//           sampleArtefact = res.body;
//           res.body.should.have.property("_id");
//           res.body.should.have.property("name");
//           res.body.should.have.property("owner");
//           res.body.should.have.property("value");
//           res.body.should.have.property("description");
//           res.body.should.have.property("file");
//           res.body.should.have.property("date");
//           done();
//       })
//     })
// })

//   describe('getting one artefact', () => {
//     it('should successfully get ONE artefact', (done) => {

//         let id = "5d8b54a1e53dae0e40d6381d";

//         let final =  { _id: '5d8b54a1e53dae0e40d6381d',
//         name: 'Buzz lightyear toy',
//         date: '2019-01-01T00:00:00.000Z',
//         owner: '5daedf03a7366a1e1a8e74f1',
//         value: 'Precious memory',
//         description: 'My son\'s favourite toy',
//         file: 'https://firebasestorage.googleapis.com/v0/b/mementos-7bca9.appspot.com/o/images%2F1569412102133?alt=media&token=15a94607-91d6-45d2-adb0-2c004ec86acf',
//         __v: 0 }

//         chai.request(server)
//         .get('/artefact/find/' + id)
//         .end((err,res) => {
//             if (err) return done(err);
//             res.status.should.be.equal(200);
//             res.body.should.be.a('object');
//             expect(res.body).to.deep.equal(final);
//             done();
//         })
//       })
//   })
  
 
  
//   describe("Re-assigning artefact", () => {
//       it('assign artefact', (done) => {
//         let artefact = {
//             artefactId: "5d873ac98e26051f13e3073c",
//             recipientId: "5d92f0247841ae35cc02e64c",
//             senderId: "5d92f2247841ae35cc02e64"
//         }

//         let expected = {
//             _id: '5d873ac98e26051f13e3073c',
//         name: 'Book',
//         date: '2018-01-01T00:00:00.000Z',
//         owner: '5d92f0247841ae35cc02e64c',
//         value: 'Wjwiwj"',
//         description: 'Bahabsu',
//         file: 'https://firebasestorage.googleapis.com/v0/b/mementos-7bca9.appspot.com/o/images%2F1569143479333?alt=media&token=e0a41d98-7626-4d65-a807-0b7c325e9f2a',
//         __v: 0 
//         }

//         chai.request(server)
//         .put('/artefact/assign')
//         .end((err, res) => {
//             if(err) return done(err);
//             res.status.should.be.equal(200);
//             res.body.should.be.a('object');
//             expect(res.body).not.to.be.empty;
//             done();

//         })
//       })
//   })

//   describe('find owner through the artefact', () => {
//       it('so first, find an artefact', (done) => {
//           let ownerId = "5d92f0247841ae35cc02e64c";
//           chai.request(server)
//           .get("/artefact/findbyowner/" + ownerId)
//           .end((err, res) => {
//               if(err) return done(err);
//               res.status.should.be.equal(200);
//               res.body.should.be.a('array')
//               done();
//           })
//       })
//   })

//   describe('To update an artefact\'s details', () => {
//     let id = '';
//     let update ={

//     };
//     it('update an artefact', (done) => {
//           chai.request(server)
//           .put('/artefact/update' + id)
//           .send(update)
//           .end((err, res) => {
//               if(err) return done(err);
//               console.log(res.body);
//               res.body.should.be.a('object');
//               res.status.should.be.equal(200);
//               done();
//           })
//       })
//   })

//   describe('To delete an artefact', () => {
//       it('To delete an artefact', (done) => {
//         let id = "5db24279ec69a40abbc276b8";
//         chai.request(server)
//         .delete('/artefact/delete')
//         .end((err,res) => {
//             if(err) return done(err);
//             res.status.should.be.equal(200);
//             res.body.should.be.a('object');
//         })
//       })
//   })

});