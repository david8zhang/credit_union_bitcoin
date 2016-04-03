var AWS = require('aws-sdk');
var sha1 = require('sha1');
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

/* Allowing easy switch between test and production databases. */
var test_database_name = 'coin_credts_union';
var production_database_name = 'coin_credits_union_test';
var database_name = test_database_name;

/* GET all the unions. */
exports.indexUnions = function(req, res) {
	var params = {};
	params.TableName = 'coin_credits_union';
	docClient.scan(params, function(err, data) {
		if(err) {
			res.send(err);
		} else {
			var response = {};
			response.credit_unions = JSON.parse(JSON.stringify(data));
			res.send(response);
		}
	})
};

/* POST a new union. */
exports.createUnion = function(req, res) {
	var params = {};
	params.TableName = 'coin_credits_union';
}
