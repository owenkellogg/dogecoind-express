var dogecoin = require('node-dogecoin')();
var controller = {};
var express = require('express');
var expressValidator = require('express-validator');

dogecoin.set('user', 'dogegate');
dogecoin.set('password', process.env.DOGECOIND_PASSWORD);
dogecoin.auth('dogegate', process.env.DOGECOIND_PASSWORD);

var app = express();
app.use(expressValidator());

controller.getInfo = function(req, res) {
  console.log('get info');

  dogecoin.exec('getinfo', function(err, info) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ dogecoind: info });
    }
  }); 

};

controller.listTransactions = function(req, res) {
  var from = req.query.from || 0;
  var count = req.query.count || 1;

  count = parseInt(count);
  from = parseInt(from);

  dogecoin.listTransactions("", count, from, function(err, transactions) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ transactions: transactions });
    }
  }); 

};


controller.getNewAddress = function(req, res) {

  dogecoin.getNewAddress(function(err, address) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ address: address });
    }
  }); 

};

controller.getTransaction = function(req, res) {
  var transactionHash = req.params.hash
  dogecoin.gettransaction(transactionHash, function(err, address) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ address: address });
    }
  }); 

};

controller.listReceivedByAddress = function(req, res) {

  dogecoin.exec('listreceivedbyaddress', function(err, received) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ received: received });
    }
  }); 

};

controller.getReceivedByAccount = function(req, res) {

  dogecoin.getreceivedbyaccount('', 2, function(err, received) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ received: received });
    }
  }); 

};

controller.getReceivedByAddress = function(req, res) {

  dogecoin.getreceivedbyaddress(req.params.address, function(err, received) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ received: received });
    }
  }); 

};

controller.getAddresses = function(req, res) {

  dogecoin.getaddressesbyaccount("", function(err, received) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ received: received });
    }
  }); 

};

controller.listReceivedByAccount = function(req, res) {

  dogecoin.listreceivedbyaccount(function(err, received) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ received: received });
    }
  }); 

};

controller.sendToAddress = function(req, res) {

  console.log('body', req.body);
  console.log('params', req.params);
  console.log('query', req.query);

  req.checkParams('address', 'Invalid receive dogecoin address').notEmpty();
  req.checkParams('amount', 'Invalid amount to send').notEmpty().isNumeric();

  if (errors = req.validationErrors()){
    res.send(400, errors);
    return;
  }

  dogecoin.sendtoaddress(req.params.address, req.params.amount, function(err, transaction) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ transaction: transaction });
    }
  }); 

};

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(userid, password, done) {
    if (userid === 'admin'){
      if (password === process.env.BASIC_AUTH_PASSWORD){
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

app.get('/v1/getinfo', basicAuth(), controller.getInfo);
app.get('/v1/getaddresses', basicAuth(), controller.getAddresses);
app.get('/v1/listtransactions', basicAuth(), controller.listTransactions);
app.get('/v1/getnewaddress', basicAuth(), controller.getNewAddress);
app.get('/v1/gettransaction', basicAuth(), controller.getTransaction);
app.get('/v1/listreceivedbyaddress', basicAuth(), controller.listReceivedByAddress);
app.get('/v1/listreceivedbyaccount', basicAuth(), controller.listReceivedByAccount);
app.get('/v1/getreceivedbyaccount', basicAuth(), controller.getReceivedByAccount);
app.get('/v1/getreceivedbyaddress/:address', basicAuth(), controller.getReceivedByAddress);
app.post('/v1/sendtoaddress/:address/:amount', basicAuth(), controller.sendToAddress);

app.listen('6421');

module.exports = controller;

