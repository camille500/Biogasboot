/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();

/* LOGIN ROUTE
----------------------------------------- */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/alternative', function(req, res) {
  res.render('alternative');
});

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
