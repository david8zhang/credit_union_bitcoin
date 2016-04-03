var AWS = require('aws-sdk');
var sha1 = require('sha1');
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

var test_database_name_charter = 'coin_credits_charter_test';
var production_database_name_charter = 'coin_credits_charter';
var test_database_name_request = 'coin_credits_request_test';
var production_database_name_request = 'coin_credits_request';

var database_name_charter = test_database_name_charter;
var database_name_request = test_database_name_request;

/* POST A new  */
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
	var charter = params.Item;
	docClient.put(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var response = {};
			response.charter = charter;
			res.status(200).send(response);
		}
	});
}

/* GET Charter information. */
exports.getCharter = function(req, res) {
	var params = {};
	params.TableName = database_name_charter;
	var charter_id = req.query.charter_id;
	params.ExpressionAttributeValues = {
		":charter_id": charter_id
	}; 
	params.FilterExpression = "charter_id = :charter_id";
	docClient.scan(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var response = {};
			var charter = {};
			var charter_raw = JSON.parse(JSON.stringify(data));

			// Enter the charter parameters
			charter.creator_id = charter_raw.Items[0].creator_id;
			charter.charter_id = charter_raw.Items[0].charter_id;
			charter.buy_in_amount = charter_raw.Items[0].buy_in_amount;
			charter.max_amt_loan_percentage = charter_raw.Items[0].max_amt_loan_percentage;
			charter.interest_rate = charter_raw.Items[0].interest_rate;
			charter.repayment_window = charter_raw.Items[0].repayment_window;

			// Send the response
			response.charter = charter;
			res.status(200).send(response);
		}
	})
}
