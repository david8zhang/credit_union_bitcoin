var AWS = require('aws-sdk');
var sha1 = require('sha1');
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

var test_database_name_charter = 'coin_credits_charter_test';
var production_database_name_charter = 'coin_credits_charter';

var database_name_charter = test_database_name_charter;

/* POST A new charter */
exports.createCharter = function(req, res) {

}