var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' , active1: 'active'});
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
  res.render('admin/list-business', {  active3: 'active'});
});

router.get('/list-outlets', function(req, res, next) {
  res.render('admin/list-outlets', {  active5: 'active'});
});

router.get('/list-categories', function(req, res, next) {
  res.render('admin/list-categories', {  active2: 'active'});
});

router.get('/list-reviews', function(req, res, next) {
  res.render('admin/list-reviews', {  active6: 'active'});
});

router.get('/list-report-reviews', function(req, res, next) {
  res.render('admin/list-report-reviews', {  active7: 'active'});
});

router.get('/list-business-owner', function(req, res, next) {
  res.render('admin/list-bo', {  active4: 'active'});
});

// router.get('/create-category', function(req, res, next) {
//   res.render('admin/layout-admin');
// });

module.exports = router;