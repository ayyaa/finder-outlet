var express = require('express');
var router = express.Router();
const models = require('../src/models');
const Sequelize = require('sequelize');
const business = models.business;
const categories = models.categories;
const address = models.address;
const business_category = models.business_category;
const validateJoi = require('../src/validation/joi-create-business');
const flash = require('connect-flash');
const config = require('../src/config/config')
const Request = require('request');
business.belongsToMany(categories, {through: 'business_category', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_category', foreignKey: 'category_id', otherKey: 'business_id'})
address.hasOne(business, {foreignKey: 'address_id'})
business.belongsTo(address)

// business.findAll({
//   attributes: ['name', 'email',
//   [Sequelize.fn('GROUP_CONCAT', Sequelize.literal("categories.name SEPARATOR ', '")), 'category']],
//   group: ['business.id'],
//   include: [{
//     model: categories,
//     attributes: [
//       'name'
//     ]
    
//     // through: {
//     //   attributes: ['category_id','business_id' ],
//     // }
//   }]
// }).then(rows => {
//   console.log(rows)
// }).catch(err => {
//   console.error(err)
// })
// var latlng = 678999+' '+67328832;
// var geom = Sequelize.fn('ST_GEOMFROMTEXT', `POINT(${latlng})`);

// address.create({
//   line1: 'jalan adisucipto', 
//   administrative_area_1: 'yogya', 
//   administrative_area_2: 'yogya', 
//   administrative_area_3: 'demangan', 
//   administrative_area_4: 'gondokusuman', 
//   postalcode: 55231,
//   point: geom
// }, {
//   include: [{
//     model: business,
//   }]
// }).then(rows => {
//   console.log(rows)
//   business.create({
//     name: 'Wonderfood',
//     address_id: rows.id,
//     owner_id: 1,
//     category_id: 1,
//     email: 'wonderfood@gmail.com'
//   })
// })

// var currentCities=[];
// var BATTUTA_KEY=config.batuta_key.key;
// var url = "https://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY;

// Request.get(url, (error, response, body) => {
//     if(error) {
//         return console.dir(error);
//     }
//     var data = JSON.parse(body);
//     console.dir(JSON.parse(body));
//     console.log(data[1].name)
// });
    // Populate country select box from battuta API
// url="https://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
// http.getJSON(url,function(countries) {
//   console.log(countries); });

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('business-owner/dashboard', { active1: 'active','message': req.flash('message'), 'info': req.flash('info')});
});

router.get('/create-business', function(req, res, next) {
  categories.findAll()
  .then(rows => {
    var BATTUTA_KEY=config.batuta_key.key;
    var url = "https://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY;

    Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var data = JSON.parse(body);
        // console.dir(JSON.parse(body));
        // console.log(data[1].name)
        res.render('business-owner/create-business', {active3: 'active', valCategories:rows, valState: data});
    });
    
  })
});

router.post('/create-business', function(req, res, next) {
  validateJoi.validate({
    contact_no: req.body.contact_no, 
    get_category: req.body.get_category, 
    name_business: req.body.name_business, 
    email: req.body.email, 
    website: req.body.website, 
    description: req.body.description, 
    line1: req.body.line1, 
    line2: req.body.line2,
    state: req.body.state, 
    province: req.body.province, 
    city: req.body.city, 
    postal_code: req.body.postal_code, 
    lat: req.body.lat, 
    lng: req.body.lng}, function(errors, value) {
    console.log(errors);
    if (!errors) {
      var latlng = req.body.lat+' '+req.body.lng;
      address.create({
        line1: req.body.line1, 
        line2: req.body.line2,
        administrative_area_1: req.body.state, 
        administrative_area_2: req.body.province, 
        administrative_area_3: req.body.city, 
        administrative_area_4: '', 
        postalcode: req.body.postal_code,
        point: Sequelize.fn('ST_GEOMFROMTEXT', `POINT(${latlng})`)
      }, {
        include: [{
          model: business,
        }]
      }).then(row => {
        console.log(row)
        business.create({
          name: req.body.name_business,
          address_id: row.id,
          owner_id: 1,
          category_id: req.body.get_category,
          email: req.body.email,
          website: req.body.website,
          contact_no: req.body.contact_no,
          description: req.body.description,
          image: 'req.body.image'
        })
        .then(rowss => {
          req.flash('success', 'Successful added Business.');
          res.redirect('/business-owner/list-business');
          console.log(rowss);
        })
      }) 
    } else {
      categories.findAll()
      .then(rows => {
        req.flash('error', errors);
        res.render('business-owner/create-business', {active3: 'active', valCategories:rows, error: req.flash('error')});
      })
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

router.post('/logout', function (req, res) {
  if(!req.isAuthenticated()) {
     notFound404(req, res, next);
  } else {
     req.logout();
     res.redirect('/login');
  }
})

module.exports = router;