var express = require('express');
var router = express.Router();
var cbTestController = require('../controllers/cbTestController.js');
var unionController = require('../controllers/unionController.js');

// TEST Api Endpoints
router.route('/coinbase/test/get_account')
	.post(cbTestController.testCoin);

router.route('/coinbase/test/send_money')
	.post(cbTestController.sendCoin);


/* -------------------------- UNION API ENDPOINTS  -------------------------- */
// Index all Unions
router.route('/unions/index')
	.get(unionController.indexUnions);

// Union profile
router.route('/unions/profile')
	.get(unionController.unionInfo);

// Request to join a union
router.route('/unions/request')
	.post(unionController.requestUnion);

// Join a union
router.route('/unions/join')
	.post(unionController.joinUnion);

// Make Payment on a union loan
router.route('/unions/pay_loan')
	.post(unionController.payLoan);

// Request Loan from the union 
router.route('/unions/request_loan')
	.post(unionController.requestLoan);

// Get an actual loan from the union
router.route('/unions/make_loan')
	.post(unionController.makeLoan);

/* -------------------------- UNION API ENDPOINTS  -------------------------- */

// Create User
router.route('/users/create')
	.post(userController.createUser);

// Remove User
router.route('/users/remove')
	.delete(userController.removeUser);

// Get User
router.route('/users/get')
	.get(userController.getUser);
module.exports = router;