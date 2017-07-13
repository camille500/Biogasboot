module.exports = function(io) {

  /* LOAD ALL DEPENDENCIES
  ----------------------------------------- */
  const express = require('express');
  const router = express.Router();
  const request = require('request');

  /* MAIN ROUTE
  ----------------------------------------- */
  router.get('/', getGas, getFeed, startCount, function(req, res, next) {
    /* SET AL LOCAL VARIABLES
    ----------------------------------------- */
    res.locals.gas = req.session.gas;
    res.locals.co2 = req.session.co2;
    res.locals.trees = req.session.trees;
    res.locals.carkm = req.session.carkm;
    res.locals.feed = req.session.feed;
    res.render('index');
  });

  /* RENDER CHECK VIEW
  ----------------------------------------- */
  router.get('/check', function(req, res, next) {
    res.render('check/index');
  });

  /* GET POST DATA AND DO CALCULATIONS
  ----------------------------------------- */
  router.post('/check', function(req, res, next) {
    req.session.persons = req.body.persons;
    let totalCO2byGas = (0.5 * 2.2) * req.session.persons; /* Here I take 0.5 kg CO2 for average per meal (demo data) */
    req.session.chk_trees = Math.floor(totalCO2byGas / 0.1369); /* 0.1369 is amount of CO2 per tree per day (365/50); */
    req.session.chk_carkm = Math.floor(totalCO2byGas / 0.125);
    req.session.chk_co2 = totalCO2byGas.toFixed(2);
    res.redirect('/check/result');
  });

  router.get('/check/result', function(req, res, next) {
    res.locals.chk_trees = req.session.chk_trees;
    res.locals.chk_carkm = req.session.chk_carkm;
    res.locals.chk_co2 = ((0.5 * 2.2) * req.session.persons).toFixed(2);
    res.render('check/result');
  });

  router.post('/check/result', createID, function(req, res, next) {
    const collection = db.collection('share');
    const id = req.session.shareID;
    let data = {
      id: id,
      name: req.body.name,
      trees: req.session.chk_trees,
      carkm: req.session.chk_carkm,
      co2: ((0.5 * 2.2) * req.session.persons).toFixed(2)
    };
    collection.findOne({
      id: id
    }, function(err, sharePage) {
      if (!sharePage) {
      collection.save(data, (err, result) => {
        if (err) return console.log(err);
        res.redirect(`/share/${id}`);
      });
    }
    });
  });

  router.get('/share/:id', function(req, res, next) {
    const collection = db.collection('share');
    const id = req.params.id;
    collection.findOne({
      id: id
    }, function(err, sharePage) {
      if (sharePage) {
        res.locals.name = sharePage.name;
        res.locals.chk_co2 = sharePage.co2;
        res.locals.chk_trees = sharePage.trees;
        res.locals.chk_carkm = sharePage.carkm;
        res.render('check/share');
      } else {
        res.redirect('/');
      }
    });
  });

  /* GET ALL GAS DATA
  ----------------------------------------- */
  function getGas(req, res, next) {
    request(`${process.env.API_URL}/status/gas?api_key=${process.env.API_KEY}`, function (error, response, body) {
      req.session.gas = JSON.parse(body);
      /* ALL CALCULATIONS BASED ON SOURCES (SEE README)
      ----------------------------------------- */
      req.session.co2 = (req.session.gas['generated'] * 2.2).toFixed(2);
      req.session.trees = (req.session.co2 / 20).toFixed(2);
      req.session.carkm = (req.session.co2 / 0.125).toFixed(2);
      next();
    });
  };

  /* GET LATEST FEED INFORMATION (KG WASTE)
  ----------------------------------------- */
  function getFeed(req, res, next) {
    /* REQUEST DATA FROM THE API ENDPOINT
    ----------------------------------------- */
    request(`${process.env.API_URL}/status/feed?api_key=${process.env.API_KEY}`, function (error, response, body) {
      req.session.feed = ((JSON.parse(body).kilograms)).toFixed(2);
      next();
    });
  };

  function createID(req, res, next) {
    const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#0123456789';
    const length = 10;
    let id = 0;
    for(let i = 0; i < length; i++) {
      id += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    req.session.shareID = id;
    next();
  }

  function startCount(req, res, next) {
    setInterval(function() {
      io.emit('update', 0.25);
    }, 10000);
    next();
  }

  /* EXPORT ROUTER
  ----------------------------------------- */
  return router;
}
