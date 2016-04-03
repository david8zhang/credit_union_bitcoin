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
var test_database_name_user= 'coin_credit_users_test';
var production_database_name_user = 'coin_credits_users';
// var test_database_name_request = 'coin_credits_request_test';
// var production_database_name_request = 'coin_credits_request';

// var database_name_request = test_database_name_request;
var database_name_user = test_database_name_user; 

var secret_key = 'rare-pepes';

/* POST a new user */
exports.createUser = function(req, res) {
	var params = {};
	params.TableName = database_name_user;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var wallet_id = req.body.wallet_id;
	var access_token = sha1(Math.floor(Date.now() / 100).toString());
	var user_id = sha1(Math.floor(Date.now()/1000).toString());
	var timestamp = Math.floor(Date.now()/1000).toString();

	params.Item = {
		user_id: user_id,
		timestamp: timestamp,
		username: username,
		email: email,
		password: password,
		access_token: access_token,
		wallet_id: wallet_id
	}
	
	var user = params.Item;

	docClient.put(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var response = {};
			response.user = user;
			res.status(200).send(response);
		}
	})	
}

/* GET a user's profile */
exports.getUser = function(req, res) {
	var params = {};
	params.TableName = database_name_user;
	var user_id = req.query.user_id;
	params.ExpressionAttributeValues = {
		":user_id": user_id
	};
	params.FilterExpression = "user_id = :user_id"
	docClient.scan(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var response = {};
			var user = {};
			var user_id = data.Items[0].user_id;
			var email = data.Items[0].email;
			var username = data.Items[0].username;
			user.user_id = user_id;
			user.email = email;
			user.username = username;
			response.user = user;
			res.status(200).send(response);
		}
	})
}


/* Autheticate a user. */
exports.authUser = function(req, res) {
	var params = {};
	params.TableName = database_name_user;
	var username = req.body.username;
	var password = req.body.password;
	params.ExpressionAttributeValues = {
		":username" : username,
		":password": password
	}
	params.FilterExpression = "username = :username AND password = :password";
	docClient.scan(params, function(err, data) {
		if(err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			var user_raw = JSON.parse(JSON.stringify(data));
			if(user_raw["Count"] == 0) {
				res.status(403).send('Account does not exist!');
			} else {
				var user_token = data.Items[0].access_token;
				var email = data.Items[0].email;
				var user = {
					user_token: user_token,
					email: email
				};
				var response = {};
				response.user = user;
				res.status(200).send(response);
			}
		}
	})
}

/* BACKDOOR! FOR TESTING PURPOSES ONLY! */
exports.backDoor = function(req, res) {
	var email = req.body.email;
	var secret_code = req.body.secret_code.toString();
	if(secret_code == secret_key) {
		var params = {};
		params.TableName = database_name_user;
		params.ExpressionAttributeValues = {
			":email": email
		};
		params.FilterExpression = "email = :email";
		docClient.scan(params, function(err, data) {
			if(err) {
				console.log(err);
				res.status(400).send(err);
			} else {
				var user_token = data.Items[0].access_token;
				var password = data.Items[0].password;
				var username = data.Items[0].username;
				var user_id = data.Items[0].user_id;
				var user = {
					username: username,
					password: password,
					user_token: user_token,
					user_id: user_id
				};
				var response = {};
				response.user = user;
				res.status(200).send(response);
			}
		})
	} else {
		res.status(404).send("Error! Not found!")
	}
}