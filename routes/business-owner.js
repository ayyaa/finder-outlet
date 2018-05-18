var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('business-owner/dashboard', { active1: 'active' });
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
  res.render('business-owner/edit-business' );
});

router.get('/edit-outlet', function(req, res, next) {
  res.render('business-owner/edit-outlet');
});

router.get('/list-business', function(req, res, next) {
  res.render('business-owner/list-business', { active2: 'active' });
});

router.get('/list-outlets', function(req, res, next) {
  res.render('business-owner/list-outlets', { active3: 'active' });
});

router.get('/list-reviews', function(req, res, next) {
  res.render('business-owner/list-reviews', { active4: 'active' });
});

module.exports = router;