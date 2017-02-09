// Configure passport for Facebook authentication
var passport = require('passport');
var passportBearer = require('passport-http-bearer');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

var test_database_name_user= 'coin_credit_users_test';
var production_database_name_user = 'coin_credits_users';
var database_name_user = test_database_name_user; 

passport.use(new passportBearer.Strategy(
	function(access_token, done) {
		var params = {};
		params.TableName = database_name_user;
		params.FilterExpression = "access_token=:access_token";
		params.ExpressionAttributeValues = {
			':access_token' : access_token,
		}; 
		docClient.scan(params, function(err, data) {
			if(err) {
				return done(err);
			} else {
				var jsonString = JSON.parse(JSON.stringify(data));
				console.log(jsonString);
				if(jsonString["Count"] == 0) {
					return done(null, false);
				} else {
					var user_id = data.Items[0].user_id;
					return done(null, user_id, { scope: 'all' });
				}
			}
		})
	}
))

exports.authToken = passport.authenticate('bearer', {session: false});