/** 
* @Author: David Zhang
* @Description: A NodeJS REST API for Coinbase-Credit_union
*/
var express = require('express');
var app = express();
var port = process.env.PORT || 8900;
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cors = require('cors');

// Configure the router
var router = require('./routes/routes.js');

//Set up express
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

//Parse the application's json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }))
app.use(methodOverride('X-HTTP-Method-Override'));

//Routes
app.use('/api/v1', router);

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

//Error handlers

//Development error handler
//will print stack trace
if (app.get('env') === 'dveelopment') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//Launch
app.listen(port);
console.log('Listening on port ' + port);

exports = module.exports = app;