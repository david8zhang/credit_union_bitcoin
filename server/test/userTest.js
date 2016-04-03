var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8900/api/v1");

// UNIT test begin

describe("Users unit test",function(){

  var token = '';
  var username = '';
  var password = '';
  var user_id = '';

  before(function(done) {
    server
    .post('/users/backDoor')
    .send({email: "pepe@pepe.com", secret_code: "rare-pepes"})
    .end(function(err, res) {
      if(err) {
        console.log(err);
      } else {
        token = res.body.user.user_token;
        username = res.body.user.username;
        password = res.body.user.password;
        user_id = res.body.user.user_id;
      }

      done();
    })
  })

  it("should create a new user with the given parameters", function(done) {
    server
    .post('/users/create')
    .send({username:"dank_memes", password:"pepeword", email:"dank@pepe.com", wallet_id: "79669e44-ee39-5430-a684-8a9e29aabab7"})
    .expect(200)
    .end(function(err, res) {
      should.equal(res.status, 200);
      should.notEqual(res.body.user.user_id, null)
      should.notEqual(res.body.user.user_id, undefined)
      done();
    })
  });

  it("should get a user's profile", function(done) {
    server
    .get("/users/profile?user_id=" + user_id)
    .expect(200)
    .set('Authorization', 'bearer ' + token)
    .end(function(err, res) {
      should.equal(res.status, 200);
      should.equal(res.body.user.user_id, user_id);
      should.equal(res.body.user.username, username);
      should.equal(res.body.user.email, "pepe@pepe.com");
      // Should not be able to query the password!
      should.not.exist(res.body.user.password);
      done();
    })
  });

  it("should be able to authenitcate the user", function(done) {
    server
    .post('/users/authenticate')
    .send({username:"Pepe_memes", password:"pepeword"})
    .expect(200)
    .end(function(err, res) {
      should.equal(res.status, 200);
      should.equal(res.body.user.user_token, token);
      done();
    })
  })
});