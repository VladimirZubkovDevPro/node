const express = require('express');
const router = express.Router();
const order = require('../models/order');
const mailer = require('../mailer');
const _ = require('underscore');

  /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('order', { products: order.getProducts() });
});

router.post('/order', function(req, res, next) {
  const errors = order.validateOrder(req.body);

  if (_.isEmpty(errors)) {
    mailer.send(req.body, function(err, data) {
      if (err) {
        res.status(404);
        res.send(err);
      }
      res.status(200);
      res.send(data);
    });
    return;
  }

  res.status(400);
  res.send(errors);
});

module.exports = router;
