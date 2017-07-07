/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();
const request = require('request');

/* LOGIN ROUTE
----------------------------------------- */
router.get('/', getGas, getFeed, function(req, res, next) {
  res.locals.gas = req.session.gas;
  res.locals.co2 = req.session.co2;
  res.locals.trees = req.session.trees;
  res.locals.carkm = req.session.carkm;
  res.locals.feed = req.session.feed;
  res.render('index');
});

router.get('/check', function(req, res, next) {
  res.render('check');
});

function getGas(req, res, next) {
  request(`${process.env.API_URL}/status/gas?api_key=${process.env.API_KEY}`, function (error, response, body) {
    req.session.gas = JSON.parse(body);
    req.session.co2 = Math.floor(req.session.gas['generated'] * 2.2);
    req.session.trees = Math.floor(req.session.co2 / 20);
    req.session.carkm = Math.floor(req.session.co2 / 0.125);
    next();
  });
};

function getFeed(req, res, next) {
  request(`${process.env.API_URL}/status/feed?api_key=${process.env.API_KEY}`, function (error, response, body) {
    req.session.feed = Math.floor(JSON.parse(body).kilograms);
    next();
  });
};

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
