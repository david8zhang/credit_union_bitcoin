// Coinbase API
var Client = require('coinbase').Client;
var client = new Client({
						'apiKey': 'KjDIt7jWZ8krOruE', 
						 'apiSecret': '76NyANKM2CBzaQWnx28MSwoKwVh9b0eZ',
						 'baseApiUri':'https://api.sandbox.coinbase.com/v2/',
						 'tokenUri': 'https://api.sandbox.coinbase.com/oauth/token'
						});

// Test the coinbase api
exports.testCoin = function(req, res) {
	client.getAccounts({}, function(err, accounts) {
		var acts = [];
		var response = {};
		accounts.forEach(function(account){
			var act_info = {};
			act_info.name = account.name;
			act_info.balance = account.balance.amount;
			act_info.id = account.id;
			acts.push(act_info);
		});
		response.Accounts = acts;
		if(err) {
			res.send(err);
		} else {
			res.send(response);
		}
	});
}

// Test making transactions
exports.sendCoin = function(req, res) {
	client.getAccount('565f895a-7478-554e-9f4b-015abdf826a4', function(err, account) {
		var args = {
			"to" : "feenam@berkeley.edu",
			"amount": "0.0001",
			"currency" : "BTC",
			"description" : "Sample transaction"
		};
		account.sendMoney(args, function(err, txn) {
			if(err) {
				console.log("Error!");
				res.send(err);
			} else {
				console.log("Success!");
				res.send(txn.id);
			}
		})
	})
}