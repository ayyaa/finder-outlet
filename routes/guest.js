var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('guest/home', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('guest/login', { title: 'Express' });
});

router.get('/regist', function(req, res, next) {
  res.render('guest/regist', { title: 'Express' });
});

router.get('/forgot', function(req, res, next) {
  res.render('guest/forgot', { title: 'Express' });
});

router.get('/browse', function(req, res, next) {
  res.render('guest/browse', { title: 'Express' });
});

router.get('/outletinfo', function(req, res, next) {
  res.render('guest/outlet-info', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  res.render('guest/search', { title: 'Express' });
});

router.get('/reviews', function(req, res, next) {
  res.render('guest/review', { title: 'Express' });
});
module.exports = router;
