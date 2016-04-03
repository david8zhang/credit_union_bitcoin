var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("USERS unit test",function(){

  it("user get test",function(done){

    server
    .get('/test_users/get')
    .expect("Content-type",/json/)
    .expect(200)
    .query({user_id = '1'})
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("user create",function(done){

    server
    .post('/test_users/create')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("user remove",function(done){

    server
    .delete('/test_users/remove')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });
});