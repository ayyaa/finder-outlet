var express = require('express');
var router = express.Router();
const models = require('../src/models');
const business = models.business;
const categories = models.categories;
const address = models.address;
const business_category = models.business_category;
const validateJoi = require('../src/validation/joi-create-business');
const flash = require('connect-flash');

business.belongsToMany(categories, {through: 'business_category', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_category', foreignKey: 'category_id', otherKey: 'business_id'})

business.findAll({
  attributes: ['name', 'email'],
  include: [{
    model: categories,
    attributes: ['name', 'description'],
    // through: {
    //   attributes: ['category_id','business_id' ],
    // }
  }]
}).then(rows => {
  console.log(rows)
}).catch(err => {
  console.error(err)
})


/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('business-owner/dashboard', { active1: 'active' });
});

router.get('/create-business', function(req, res, next) {
  categories.findAll()
  .then(rows => {
    res.render('business-owner/create-business', {active3: 'active', valCategories:rows});
  })
});

router.post('/create-business', function(req, res, next) {
  validateJoi.validate({
    image: req.body.image, 
    contact_no: req.body.contact_no, 
    get_category: req.body.get_category, 
    name_business: req.body.name_business, 
    email: req.body.email, 
    website: req.body.website, 
    description: req.body.description, 
    line1: req.body.line1, 
    line2: req.body.line2, 
    province: req.body.province, 
    city: req.body.city, 
    postal_code: req.body.postal_code, 
    lat: req.body.lat, 
    lng: req.body.lng}, function(errors, value) {
    // console.log(errors);
    if (!errors) {
      business.findOne({
        attributes: ['name'],
        where: {
          name: req.body.name_business
        }
      })
      .then(rows => {
        if (rows.length > 0) {
          console.log(rows);
          req.flash('error', 'Duplicate entry name business !');
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
      res.render('business-owner/create-business', {active3: 'active', valCategories:rows, error: req.flash('error')});
      // res.render('admin/create-category', {error: req.flash('error')});
    } 
  })
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