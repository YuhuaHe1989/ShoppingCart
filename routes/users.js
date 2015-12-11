'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');

// USERS

router.post('/register', function(req, res) {
  console.log('req.body:', req.body)
  User.register(req.body, function(err, user){
    res.status(err || !user ? 400 : 200).send(err || {token: user.token()});
  });
});

router.get('/cart/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    res.status(err ? 400 : 200).send(err || user);
  });
});

router.put('/addtocart', function(req, res) {
  User.findOneAndUpdate({id: req.body._id}, {$push: { cart: req.body.book}}, 
    function(err, data) {
      console.log(data);
    });
});

router.post('/login', function(req, res) {
  User.authenticate(req.body, function(err, user){
    if(err || !user) {
      res.status(400).send(err);
    } else {
      var token = user.token();
      var id = user._id;
      res.send({token: token, id: id});
    }
  });
});

module.exports = router;
