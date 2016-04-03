var AWS = require('aws-sdk');
var sha1 = require('sha1');
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

var test_database_name_charter = 'coin_credits_charter_test';
var production_database_name_charter = 'coin_credits_charter';

var database_name_charter = test_database_name_charter;

/* POST A new charter */
exports.createCharter = function(req, res) {
	var params = {};
	params.TableName = database_name_charter;
	var creator_id = req.body.creator_id;
	var buy_in_amount = req.body.buy_in_amount;
	var max_amt_loan_percentage = req.body.max_amt_loan_percentage;
	var interest_rate = req.body.interest_rate;
	var repayment_window = req.body.repayment_window;
	var charter_id = sha1(Math.floor(Date.now()/1000).toString());

	params.Item = {
		charter_id: charter_id,
		creator_id: creator_id,
		buy_in_amount: buy_in_amount,
		max_amt_loan_percentage: max_amt_loan_percentage,
		interest_rate: interest_rate,
		repayment_window: repayment_window
	}
	charter = params.Item;
	docClient.put(params, function(err, data) {
		if(err) {
			res.status(400).send(err);
		} else {
			var response = {};
			response.charter = charter;
			res.status(200).send(charter);
		}
	});
}