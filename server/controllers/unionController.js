var AWS = require('aws-sdk');
var sha1 = require('sha1');
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

// Coinbase API sandbox test account stuff
var Client = require('coinbase').Client;
var client = new Client({
						'apiKey': 'KjDIt7jWZ8krOruE', 
						 'apiSecret': '76NyANKM2CBzaQWnx28MSwoKwVh9b0eZ',
						 'baseApiUri':'https://api.sandbox.coinbase.com/v2/',
						 'tokenUri': 'https://api.sandbox.coinbase.com/oauth/token'
						});

/* Allowing easy switch between test and production databases. */
var test_database_name_union = 'coin_credits_union_test';
var production_database_name_union = 'coin_credits_union';
var test_database_name_request = 'coin_credits_request_test';
var production_database_name_request = 'coin_credits_request';

var database_name_request = test_database_name_request;
var database_name_union = test_database_name_union;

/* GET all the unions. */
exports.indexUnions = function(req, res) {
	var params = {};
	params.TableName = database_name_union;
	docClient.scan(params, function(err, data) {
		if(err) {
			res.status(400).send(err);
		} else {
			var response = {};
			response.credit_unions = JSON.parse(JSON.stringify(data));
			res.status(200).send(response);
		}
	})
};

/* GET a credit specific credit union's profile */
exports.unionInfo = function(req, res) {
	var params = {};
	var union_id = req.query.union_id;
	params.TableName = database_name_union;
	params.ExpressionAttributeValues = {
		":union_id" : union_id
	}
	params.FilterExpression = "union_id = :union_id";
	docClient.scan(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var response = {};
			var credit_union = JSON.parse(JSON.stringify(data));
			response.credit_union = credit_union;
			res.status(200).send(response);
		}
	})
};

/* POST a new credit union. */
exports.createUnion = function(req, res) {
	var params = {};
	params.TableName = database_name_union;
	var union_id = sha1(Math.floor(Date.now()/1000).toString());
	var union_name = req.body.name;
	var charter_id = req.body.charter_id;
	var user_ids = [];
	var union_wallet_id;
	
	// Create a new bitcoin wallet
	client.createAccount({name: union_name}, function(err, account) {
		union_wallet_id = account.id;
		params.Item = {
			union_id: union_id,
			union_name: union_name,
			charter_id: charter_id,
			user_ids: user_ids,
			union_wallet_id: union_wallet_id
		};
		docClient.put(params, function(err, data) {
			if(err) {
				console.log(err);
				res.status(400).send(err);
			} else {
				var response = {};
				response.union_id = union_id;
				response.union_wallet_id = union_wallet_id;
				res.status(200).send(response);
			}
		});
	})
}

/* POST a new request */
exports.requestUnion = function(req, res) {
	var params = {};
	params.TableName = database_name_request;
	var user_id = req.body.user_id;
	var union_id = req.body.union_id;
	var request_id = sha1(Math.floor(Date.now()/1000).toString());
	var request_type = 1;
	var request_timestamp = Math.floor(Date.now()/1000).toString();
	var request_status = "open";
	params.Item = {
		user_id: user_id,
		union_id: union_id,
		request_id: request_id,
		request_type: request_type,
		request_timestamp: request_timestamp,
		request_status: request_status
	};
	docClient.put(params, function(err, data){
		if(err) {
			console.log(err);
			res.status(400).send(err); 
		} else {
			var response = {};
			var request = {};
			request.request_id = request_id;
			request.union_id = union_id;
			request.user_id = user_id;
			request.request_type = request_type;
			response.request = request;
			res.status(200).send(response);
		}
	})
}