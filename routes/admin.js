var express = require('express');
var router = express.Router();
const models = require('../src/models');
const categories = models.categories;
const validateJoi = require('../src/validation/joi-create-category');
const flash = require('connect-flash');

router.get('/dashboard', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' , active1: 'active'});
});

router.get('/create-category', function(req, res, next) {
  res.render('admin/create-category');
});

router.post('/create-category', function(req, res, next) {
  validateJoi.validate({name_category: req.body.name_category, description: req.body.description}, function(errors, value) {
    console.log(errors);
    if (!errors) {
      categories.findOne({
        attributes: ['name'],
        where: {
          name: req.body.name_category
        }
      })
      .then(rows => {
        if (rows.length > 0) {
          concole.log(rows)
          req.flash('error', 'Duplicate entry name category !');
          // alert("Duplicate entry name category !");          
        } else {
          categories.create({ 
            name: req.body.name_category, 
            description: req.body.description 
          })
          .then(rows => {
            req.flash('success', 'Successful added categories.');
            res.redirect('/admin/list-categories');
            console.log(rows);
          })
        }
      })
      .catch(() => {
        res.status(500).json({"status_code": 500,"status_message": "internal server error"});
      })
    } else {
      req.flash('error', errors);
      res.render('admin/create-category', {error: req.flash('error')});
    } 
  })
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
  categories.findAll()
  .then(rows => {
    console.log(rows);
    // res.render('admin_list', {title: 'User List', data: rows, nameTag: req.user.user});
    res.render('admin/list-categories', { active2: 'active', 'success' : req.flash('success'), data: rows});
  })
  .catch(() => {
    res.status(500).json({"status_code": 500,"status_message": "internal server error"});
  })
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