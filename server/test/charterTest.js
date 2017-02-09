var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:8900/api/v1");

describe("Charter unit tests", function() {
	/* Uncomment when done creating charters */
	// it("should create a new charter", function(done) {
	// 	server
	// 	.post('/charter/create')
	// 	.send({creator_id: '1', buy_in_amount: '0.001', max_amt_loan_percentage: '10', 
	// 		   interest_rate: '0.005', repayment_window: '20'})
	// 	.expect(200)
	// 	.end(function(err, res) {
	// 		should.equal(res.status, 200);
	// 		should.equal(res.body.charter.creator_id, '1');
	// 		should.equal(res.body.charter.buy_in_amount, '0.001');
	// 		should.equal(res.body.charter.max_amt_loan_percentage, '10');
	// 		should.equal(res.body.charter.interest_rate, '0.005');
	// 		should.equal(res.body.charter.repayment_window, '20');
	// 		should.exist(res.body.charter.charter_id);
	// 		done();
	// 	})
	// });

	it("should return the charter information", function(done) {
		server
		.get('/charter/profile?charter_id=c0a7aed249dd6d570759cc31359a91c8599f0b75')
		.expect(200)
		.end(function(err, res) {
			should.equal(res.status, 200);
			should.equal(res.body.charter.creator_id, '1');
			should.equal(res.body.charter.buy_in_amount, '0.001');
			should.equal(res.body.charter.max_amt_loan_percentage, '10');
			should.equal(res.body.charter.interest_rate, '0.005');
			should.equal(res.body.charter.repayment_window, '20');
			should.exist(res.body.charter.charter_id);
			done();
		})
	});

	/* Worry about the edit route later */
	// it("should edit the charter buy_in_amount, max_amt_loan_percentage, interest_rate", function(done) {
	// 	server
	// 	.post('/charter/request')
	// 	.send({charter_id="c0a7aed249dd6d570759cc31359a91c8599f0b75", buy_in_amount: "0.002", max_amt_loan_percentage: "20", interest_rate: "0.004"})
	// 	.end(function(err, res) {
	// 		should.equal(res.status, 200);
	// 		should.equal(res.body.request.request_type, 3);
	// 		should.equal(res.body.request.request_charter_id, "c0a7aed249dd6d570759cc31359a91c8599f0b75");
	// 	})
	// })
})