var dogecoin = require('node-dogecoin')();
var controller = {};
var express = require('express');
var expressValidator = require('express-validator');

dogecoin.set('user', 'dogegate');
dogecoin.set('password', "rGtrDFTRz9CSWHypuQHygDxkPFS5wsK2mr");
dogecoin.auth('dogegate', "rGtrDFTRz9CSWHypuQHygDxkPFS5wsK2mr");

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

  dogecoin.getreceivedbyaccount('', function(err, received) {
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

  req.checkBody('address', 'Invalid receive dogecoin address').notEmpty();
  req.checkBody('amount', 'Invalid amount to send').notEmpty().isNumeric();

  if (errors = req.validationErrors()){
    res.send(400, errors);
    return;
  }

  dogecoin.sendtoaddress(function(err, transaction) {
    if (err) {
      res.send(500, { error: err }); return;
    } else {
      res.send({ transaction: transaction });
    }
  }); 

};

app.get('/v1/getinfo', controller.getInfo);
app.get('/v1/getaddresses', controller.getAddresses);
app.get('/v1/listtransactions', controller.listTransactions);
app.get('/v1/getnewaddress', controller.getNewAddress);
app.get('/v1/gettransaction', controller.getTransaction);
app.get('/v1/listreceivedbyaddress', controller.listReceivedByAddress);
app.get('/v1/listreceivedbyaccount', controller.listReceivedByAccount);
app.get('/v1/getreceivedbyaccount', controller.getReceivedByAccount);
app.get('/v1/getreceivedbyaddress/:address', controller.getReceivedByAddress);
app.post('/v1/sendtoaddress', controller.sendToAddress);

app.listen('6421');

module.exports = controller;

