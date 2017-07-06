/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();

/* LOGIN ROUTE
----------------------------------------- */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/check', function(req, res) {
  res.render('check');
});

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
