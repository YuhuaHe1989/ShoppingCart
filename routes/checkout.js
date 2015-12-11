'use strict';

var express = require('express');
var router = express.Router();

var stripe = require("stripe")(process.env.SK_KEY);

router.post('/', function(req, res) {
  var tokenObj = req.body.tokenObj;
  var total = req.body.totalprice * 100;

  var charge = stripe.charges.create({
    amount: total, // amount in cents, again
    currency: "usd",
    source: tokenObj.id,
    description: `title by author`
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      res.status(400).send(err);
    }else {
      res.send(charge);
    }
  });
});


module.exports = router;