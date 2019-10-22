process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const userSchema = require('../schema/userSchema');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model("userSchema", userSchema);

//Our parent block
describe('User', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     User.remove({}, (err) => { 
    //        done();           
    //     });        
    // });
/*
  * Test the /GET route
  */
  describe("login", () => {
      it('should successfully login the user', (done) => {
          let loginDeets = {
            email: "fifikwong70@yahoo.com",
            password: "123456"
          };

          chai.request(server)
            .post('/login/local')
            .send(loginDeets)
            .end((err,res) => {
                // res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('dob');
                res.body.should.have.property('pictureUrl');
              done();
            })
      })
  })

  describe('login fail', () => {
      it('should fail login', () => {
          let loginDeets = {
              email: "fifikwong70@yahoo.com",
              password: 'janseniscool'
          };

          chai.request(server)
            .post('login/local')
            .send(loginDeets)
            .end((err, res) => {
                // console.log(res.body);
                // expect(res.body).to.be.null;
            done();
            })
      })
  })

  describe('/GET user', () => {
      it('it should GET user', (done) => {
        chai.request(server)
            .get('/user')
            .end((err, res) => {
                  // res.should.have.status(200);
                  console.log(res.body);
                  res.body.should.be.a('object');
                //   res.body.should.be.eql(user);
              done();
            });
      });
  });

});