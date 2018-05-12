var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('business-owner/dashboard', { title: 'Express' });
});

router.get('/create-business', function(req, res, next) {
  res.render('business-owner/create-business');
});

router.get('/create-outlet', function(req, res, next) {
  res.render('business-owner/create-outlet');
});


router.get('/account', function(req, res, next) {
  res.render('business-owner/account');
});

router.get('/edit-business', function(req, res, next) {
  res.render('business-owner/edit-business');
});

router.get('/edit-outlet', function(req, res, next) {
  res.render('business-owner/edit-outlet');
});

router.get('/list-business', function(req, res, next) {
  res.render('business-owner/list-business');
});

router.get('/list-outlets', function(req, res, next) {
  res.render('business-owner/list-outlets');
});

router.get('/list-reviews', function(req, res, next) {
  res.render('business-owner/list-reviews');
});

module.exports = router;