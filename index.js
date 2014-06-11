var controller = {};
var express = require('express');
var expressValidator = require('express-validator');
var dogecoinController = require(__dirname+"/lib/dogecoin_controller.js");

var config = require(__dirname+"/config/config.js");

var app = express();
app.use(expressValidator());


var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(userid, password, done) {
    if (userid === 'admin'){
      if (password === config.get('basic_auth_password')){
        done(null, true);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }   
  }
));

function basicAuth(){
  return passport.authenticate('basic', { session: false });
}
app.use(passport.initialize());

app.get('/v1/getinfo', basicAuth(), dogecoinController.getInfo);
app.get('/v1/getaddresses', basicAuth(), dogecoinController.getAddresses);
app.get('/v1/listtransactions', basicAuth(), dogecoinController.listTransactions);
app.get('/v1/getnewaddress', basicAuth(), dogecoinController.getNewAddress);
app.get('/v1/gettransaction', basicAuth(), dogecoinController.getTransaction);
app.get('/v1/listreceivedbyaddress', basicAuth(), dogecoinController.listReceivedByAddress);
app.get('/v1/listreceivedbyaccount', basicAuth(), dogecoinController.listReceivedByAccount);
app.get('/v1/listsinceblock/:block_hash', basicAuth(), dogecoinController.listSinceBlock);
app.get('/v1/getreceivedbyaccount', basicAuth(), dogecoinController.getReceivedByAccount);
app.get('/v1/getreceivedbyaddress/:address', basicAuth(), dogecoinController.getReceivedByAddress);
app.post('/v1/sendtoaddress/:address/:amount', basicAuth(), dogecoinController.sendToAddress);

app.listen('6421');

module.exports = controller;

