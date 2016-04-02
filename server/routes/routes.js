var express = require('express');
var router = express.Router();
var cbTestController = require('../controllers/cbTestController.js');

// TEST Api Endpoints
router.route('/coinbase/test/get_account')
	.post(cbTestController.testCoin);

router.route('/coinbase/test/send_money')
	.post(cbTestController.sendCoin);

module.exports = router;