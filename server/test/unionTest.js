var supertest = require("supertest");
var should = require("should");

// Unit tests for Union routes

var server = supertest.agent("http://localhost:8900/api/v1");

describe("Union unit test",function(){
  it("should return all credit unions",function(done){

    // calling union index api route
    server
    .get("/unions/index")
    .expect("Content-type",/json/)
    .expect(200) 
    .end(function(err,res){
      // HTTP status should be 200
      should.equal(res.status, 200);
      // THh credit unions should exist
      should.exist(res.body.credit_unions);
      done();
    });
  });

  it("should return the credit union balance and total assets", function(done) {
    // Calling union profile api route
    server
    .get("/unions/profile?union_id=1908809186ff628219046de0bc1602766d0dcd0c")
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      // HTTP Status should be 200
      should.equal(res.status, 200);
      should.exist(res.body.credit_union);
      should.notEqual(res.body.credit_union.balance, null);
      should.notEqual(res.body.credit_union.balance, undefined);
      done();
    })
  });

  /* Uncomment this test when adding to test route */
  // it("should create a union and a new bitcoin wallet", function(done) {
  //   // Calling union profile api route
  //   server
  //   .post("/unions/create")
  //   .send({charter_id: "1234", name: "pepe_new_union", creator_id: "33c7676ea320cd1f4c927868ddba20a5b7cc274f"})
  //   .expect("Content-type", /json/)
  //   .expect(200)
  //   .end(function(err, res) {
  //     should.equal(res.status, 200);
  //     should.notEqual(res.body.union_id, null);
  //     should.notEqual(res.body.union_id, undefined);
  //     should.notEqual(res.body.union_wallet_id, null);
  //     should.notEqual(res.body.union_wallet_id, undefined);
  //     done();
  //   })
  // });

  it("should create a request to join a union", function(done) {
    server
    .post("/unions/request")
    .send({union_id: "1", user_id: "1"})
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      should.equal(res.status, 200);
      should.notEqual(res.body.request.request_id, null);
      should.notEqual(res.body.request.request_id, undefined);
      should.equal(res.body.request.request_type, 1);
      should.equal(res.body.request.user_id, 1);
      should.equal(res.body.request.union_id, 1);
      done();
    });
  });

  it("Should allow users to join a union", function(done) {
    server
    .post("/unions/request")
    .send({user_id: "33c7676ea320cd1f4c927868ddba20a5b7cc274f", union_id: "1908809186ff628219046de0bc1602766d0dcd0c"})
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      should.equal(res.status, 200);
      done();
    })
  });

  /* We'll worry about this later */
  it("Should allow users to make loan requests on a union", function(done) {
    server
    .post("/unions/request_loan")
    .send({user_id:"33c7676ea320cd1f4c927868ddba20a5b7cc274f", union_id:"1908809186ff628219046de0bc1602766d0dcd0c"})
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      should.equal(res.status, 200);
      should.exist(res.body.request);
      done();
    })
  });

  it("Should allow credit union itself to actually make loans", function(done) {
    server
    .post("/unions/make_loan")
    .send({user_id:"33c7676ea320cd1f4c927868ddba20a5b7cc274f", 
           union_id:"1908809186ff628219046de0bc1602766d0dcd0c",
           amount: "0.0001"})
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      should.equal(res.status, 200);
      should.exist(res.body.acct.transaction_id);
      should.exist(res.body.acct.balance);
      should.notEqual(res.body.acct.balance, 0);
      done();
    })
  });
});