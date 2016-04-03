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

/* Databae of all request objects */
var test_database_name_request = 'coin_credits_request_test';
var production_database_name_request = 'coin_credits_request';

/* Database of all users. */
var test_database_name_user= 'coin_credit_users_test';
var production_database_name_user = 'coin_credits_users';

/* Actal database being used in the code. */
var database_name_request = test_database_name_request;
var database_name_union = test_database_name_union;
var database_name_user = test_database_name_user; 

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
			var credit_union = {};

			// The raw json data
			var union_raw = JSON.parse(JSON.stringify(data));
			
			// Enter in the id's and name
			var account_id = union_raw.Items[0].union_wallet_id;
			var union_name = union_raw.Items[0].union_name;
			var union_id = union_raw.Items[0].union_id;

			// Get the balance of the credit union
			client.getAccount(account_id, function(err, account) {
				credit_union.union_name = union_name;
				credit_union.account_id = account_id;
				credit_union.union_id = union_id;
				credit_union.balance = account.balance.amount;
				response.credit_union = credit_union;
				res.status(200).send(response);
			})
		}
	})
};

/* POST a new credit union. */
exports.createUnion = function(req, res) {
	var params = {};
	params.TableName = database_name_union;
	var creator_id = req.body.creator_id;
	var union_id = sha1(Math.floor(Date.now()/1000).toString());
	var union_name = req.body.name;
	var charter_id = req.body.charter_id;
	var members = docClient.createSet([creator_id]);
	var union_wallet_id;
	
	// Create a new bitcoin wallet
	client.createAccount({name: union_name}, function(err, account) {
		union_wallet_id = account.id;
		params.Item = {
			union_id: union_id,
			union_name: union_name,
			charter_id: charter_id,
			members: members,
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
	});
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

/* POST a new user.*/
exports.joinUnion = function(req, res) {
	var params = {};
	params.TableName = database_name_union;
	var user_id = docClient.createSet([req.body.user_id]);
	var union_id = req.body.union_id;
	params.Key = {
		union_id: union_id
	}
	params.UpdateExpression = "ADD members :user_id";
	params.ExpressionAttributeValues = {
		":user_id" : user_id
	};
	docClient.update(params, function(err, data) {
		if(err) {
			res.status(400).send(err);
		} else {
			var response = {};
			var join = {};
			join.user_id = user_id;
			join.union_id = union_id;
			response.join = join;
			res.status(200).send(response);
		}
	})
};

/* Request a loan. */
exports.requestLoan = function(req, res) {
	var params = {};
	params.TableName = database_name_request;
	var user_id = req.body.user_id;
	var union_id = req.body.union_id;
	var request_id = sha1(Math.floor(Date.now()/ 1000).toString());
	var request_type = 2;
	var request_approved = "no";
	var request_votes = 0;
	params.Item = {
		user_id: user_id,
		union_id: union_id,
		request_id: request_id,
		request_type: request_type,
		request_approved: request_approved,
		request_votes: request_votes
	}
	var request = params.Item;
	docClient.put(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var response = {};
			response.request = request;
			res.status(200).send(response);
		}
	})
}

/* Make a loan to a user */
exports.makeLoan = function(req, res) {
	var user_params = {};
	user_params.TableName = database_name_user;
	var user_id = req.body.user_id;
	var union_id = req.body.union_id;
	var amount = req.body.amount;
	user_params.ExpressionAttributeValues = {
		":user_id" : user_id
	}
	user_params.FilterExpression = "user_id = :user_id";
	docClient.scan(user_params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var email = data.Items[0].email;
			var union_params = {};
			union_params.ExpressionAttributeValues = {
				":union_id" : union_id
			};
			union_params.TableName = database_name_union;
			union_params.FilterExpression = "union_id = :union_id";
			docClient.scan(union_params, function(err, results) {
				if(err) {
					console.log(err);
					res.status(400).send(err);
				} else {
					var union_wallet_id = results.Items[0].union_wallet_id;
					var args = {
						"to" : email,
						"amount" : amount,
						"currency" : "BTC",
						"description" : "Sample loan"
					};
					client.getAccount(union_wallet_id, function(err, account) {
						account.sendMoney(args, function(err, txn) {
							if(err) {
								console.log(err);
								res.status(400).send(err);
							} else {
								var acct = {}; 
								var response = {};
								acct.balance = account.balance.amount;
								acct.transaction_id = txn.id;
								response.acct = acct;
								res.status(200).send(response);
							}
						});
					});
				}
			})
		}
	})
}