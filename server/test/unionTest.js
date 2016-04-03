var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("USERS unit test",function(){

  // #1 should return home page

  it("should return home page",function(done){

    // calling home page api
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      // Error key should be false.
      res.body.error.should.equal(false);
      done();
    });
  });

  it("union get test",function(done){

    server
    .post('/unions/get')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.error.should.equal("UNION DOES NOT EXIST");
      done();
    });
  });

  it("union create",function(done){

    server
    .post('/unions/create')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.error.should.equal("USER ALREADY EXISTS");
      done();
    });
  });

  it("union remove",function(done){

    server
    .post('/users/remove')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.error.should.equal("USER DOES NOT EXIST");
      done();
    });
  });

  it("union remove",function(done){ --

    server
    .post('/users/remove')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.error.should.equal("USER DOES NOT EXIST");
      done();
    });
  });


});