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
// args: union_id
router.route('/unions/profile')
	.get(unionController.unionInfo);

// Create a union
// args: charter_id
router.route('/unions/create')
	.post(unionController.createUnion);

// Request to join a union
// args: union_id, user_id
router.route('/unions/request')
	.post(unionController.requestUnion);

// Join a union
// args: union_id, user_id
router.route('/unions/join')
	.post(unionController.joinUnion);

// Make Payment on a union loan
// args: union_id, user_id
router.route('/unions/pay_loan')
	.post(unionController.payLoan);

// Request Loan from the union
// args: union_id, user_id 
router.route('/unions/request_loan')
	.post(unionController.requestLoan);

// Get an actual loan from the union
// args: union_id, user_id
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