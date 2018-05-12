var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' });
});


router.get('/create-category', function(req, res, next) {
  res.render('admin/create-category');
});

router.get('/account', function(req, res, next) {
  res.render('admin/account');
});

router.get('/edit-category', function(req, res, next) {
  res.render('admin/edit-category');
});

router.get('/list-business', function(req, res, next) {
  res.render('admin/list-business');
});

router.get('/list-outlets', function(req, res, next) {
  res.render('admin/list-outlets');
});

router.get('/list-categories', function(req, res, next) {
  res.render('admin/list-categories');
});

router.get('/list-reviews', function(req, res, next) {
  res.render('admin/list-reviews');
});

module.exports = router;