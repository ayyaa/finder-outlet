var express = require('express');
var router = express.Router();
const models = require('../src/models');
const Sequelize = require('sequelize');
const twoFactor = require('node-2fa');
const bcrypt = require('bcrypt-nodejs');
const business = models.business;
const multer = require('multer')
const categories = models.categories;
const address = models.address;
const business_category = models.business_category;
const users = models.users;
const validateJoi = require('../src/validation/joi-create-business');
const flash = require('connect-flash');
const config = require('../src/config/config')
const Request = require('request');
business.belongsToMany(categories, {through: 'business_category', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_category', foreignKey: 'category_id', otherKey: 'business_id'})
business_category.belongsTo(business, {foreignKey: 'business_id'})
business.hasOne(business_category, {foreignKey: 'business_id'})
business_category.belongsTo(categories, {foreignKey: 'category_id'})
categories.hasOne(business_category, {foreignKey: 'category_id'})
address.hasOne(business, {foreignKey: 'address_id'})
business.belongsTo(address, {foreignKey: 'address_id'})
const multerConfig = {
    
  storage: multer.diskStorage({
   //Setup where the user's file will go
   destination: function(req, file, next){
     next(null, './public/photo-storage');
     },   
      
      //Then give the file a unique name
      filename: function(req, file, next){
          console.log(file);
          const ext = file.mimetype.split('/')[1];
          next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
      }),   
      
      //A means of ensuring only images are uploaded. 
      fileFilter: function(req, file, next){
            if(!file){
              next();
            }
          const image = file.mimetype.startsWith('image/');
          if(image){
            console.log('photo uploaded');
            next(null, true);
          }else{
            console.log("file not supported");
            
            //TODO:  A better message response to user on failure.
            return next();
          }
      }
    };

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
//   postalcode: 55231
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
  res.render('business-owner/dashboard', { active1: 'active','message': req.flash('message'),'info': req.flash('info'), user: req.user[0]});
});

router.post('/upload',multer(multerConfig).single('photo'),function(req,res){
  console.log(req.file.path)
  users.update(
    {photo: req.file.filename}
  , {where: {
    id: [req.user[0].id]
  }}).then(rows => {
    console.log(rows)
    res.redirect('/business-owner/account');
  }).catch(err => {
    console.error(err)
    res.send('error')
  })
});

router.post('/deactive', function(req, res, next) {
  users.update(
    {status: 0}
  , {where: {
    id: [req.user[0].id]
  }}).then(rows => {
    req.logout();
    res.redirect('/');
  }).catch(err => {
    console.error(err)
    res.send('error')
  })
})

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
        res.render('business-owner/create-business', {active2: 'active', valCategories:rows, valState: data, api_key: BATTUTA_KEY , user: req.user[0]});
    });
  })
});

router.post('/create-business', function(req, res, next) {
  validateJoi.validate({
    contact_no: req.body.contact_no, 
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
      address.create({
        line1: req.body.line1, 
        line2: req.body.line2,
        administrative_area_1: req.body.state, 
        administrative_area_2: req.body.province, 
        administrative_area_3: req.body.city, 
        administrative_area_4: '', 
        postalcode: req.body.postal_code,
        point: Sequelize.fn(`ST_GEOMFROMTEXT`, `POINT(`+req.body.lat+` `+req.body.lng+`)`)
      }, {
        include: [{
          model: business,
        }]
      }).then(row => {
        console.log('ini kategory '+req.body.get_category)
        business.create({
          name: req.body.name_business,
          address_id: row.id,
          owner_id: req.user[0].id,
          email: req.body.email,
          website: req.body.website,
          contact_no: req.body.contact_no,
          description: req.body.description,
          image: 'req.body.image'
        })
        .then(rowss => {
          var length_of_category = req.body.get_category;
          length_of_category = length_of_category.length;
          for( var x = 0 ; x < length_of_category ; x++ ) {
            business_category.create({
              business_id: rowss.id,
              category_id: req.body.get_category[x]
            }).then(rows => {
              req.flash('success', 'Successful added Business.');
              res.redirect('/business-owner/list-business');
              console.log(rowss);
            })
          }
        })
      }) 
    } else {
      categories.findAll()
      .then(rows => {
        req.flash('error', errors);
        res.render('business-owner/create-business', {active3: 'active', valCategories:rows, error: req.flash('error'), user: req.user[0]});

      })
      // res.render('admin/create-category', {error: req.flash('error')});
    } 
  })
});

// router.post('/create-business', function(req, res, next) {
//     validateJoi.validate({
//       get_category: req.body.get_category, 
// }, function(errors, value) {
//       var len = req.body.get_category;
//       console.log(len.length)
//     })
//   });

router.get('/get-geolocate', function(req, res, next) {
  res.render('business-owner/create-outlet');
});

router.get('/create-outlet', function(req, res, next) {
  business.findAll({
  })
  .then(rows => {
    console.log(rows)
    res.render('business-owner/create-outlet',{user: req.user[0], valBusiness: rows});
  })
  
});

router.post('/update', function(req, res, next) {
  var upd = {name: req.body.name, email: req.body.email, contact_no: req.body.phone}
  users.update(
    upd
  , {where: {
    id: [req.user[0].id]
  }}).then(rows => {
    console.log(upd)
    res.send(JSON.stringify(upd))
  }).catch(err => {
    console.error(err)
    res.send('error')
  })
})

router.post('/updatepass', function(req, res, next) {
  var pass = bcrypt.hashSync(req.body.newpass)
  var upd = {password: pass}
  users.findOne({
    where: {
      id: [req.user[0].id]
    }
  }).then(rows => {
    console.log(rows.password)
    console.log(req.body.oldpass)
    bcrypt.compare(req.body.oldpass,rows.password, function(err, respon) {
      if(respon) {
        users.update(
          upd
        , {where: {
          id: [req.user[0].id]
        }}).then(rows => {
          res.send(true)
        }).catch(err => {
          console.error(err)
          res.send(false)
        })
       } else {
        console.log('password wrong!!')
        res.send(false)
       } 
    });   
  })
})

router.get('/check/:token', function(req, res, next) {
  var verifytoken = twoFactor.verifyToken(req.user[0].fa_key, req.params.token);
  console.log(req.params.token)
  if (verifytoken !== null) {
    res.send(true);
  } else {
    res.send(false);
    // return false
  }
 });

router.post('/enable/:id', function(req, res, next) {
  users.update({
    fa_status: 1
  }, {where: {
    id: [req.params.id]
  }}).then(rows => {
    res.send('success')
  }).catch(err => {
    console.error(err)
    res.send('error')
  })
});

router.post('/disable/:id', function(req, res, next) {
  users.update({
    fa_status: 0
  }, {where: {
    id: [req.params.id]
  }}).then(rows => {
    res.send('success')
  }).catch(err => {
    console.error(err)
    res.send('error')
  })
});

router.get('/account', function(req, res, next) {
  if(req.user[0].fa_status === 1) {
    var auth = true
  } else {
    var auth = false
  }
  // console.log(auth)
  res.render('business-owner/account', {user: req.user[0], vauth: auth});
});

// router.get('/edit-business=:id', function(req, res, next) {
//   business_category.findAll({
//     attributes: [
//       'category_id'
//     ],
//     where: {
//       business_id: req.params.id
//     }
//   })
//   .then(business_category => {
//     // console.log(business_category)
//     var category = business_category.category_id;
//     business.findAll({
//       where: {
//         id: req.params.id
//       }
//     })
//     .then(business => {
//       address.findAll({
//         where: {
//           id: business.address_id
//         }
//       })
//       .then(address => {
//         console.log(business_category);
//         console.log(business);
//         console.log(address);

//       })
//     })
//   })
// });

router.get('/edit-business=:id', function(req, res) {
  business.findAll({
    where: {
      id: [req.params.id]
    },
    attributes: [
      'id',
      'name', 
      'email',
      'website',
      'contact_no',
      'description',

      [Sequelize.fn('GROUP_CONCAT', Sequelize.literal("categories.id SEPARATOR ','")), 'category']
    ],
    group: ['business.id'],
    include: [{
      model: categories,
      // through: {
      //   attributes: ['category_id','business_id' ],
      // }
      },
      {
        model: address
        }],
      distinct: true,
      raw:true
      })
  // business.findAll({
  //   where: {
  //     id: [req.params.id]
  //   },
  //   include: [ {
  //     model: business_category,
  //     where: {
  //       business_id:req.params.id
  //     },
  //     include: [ {
  //       model: categories,
  //     }
  //   ]
  //   }, {
  //     model: address
  //     }
  //   ],
  //   // group: ['business.id'],
  //   distinct: true,
  //   raw:true
  // })
  .then(rows => {
    categories.findAll({
    })
    .then(row => {
      console.log(rows)
      var BATTUTA_KEY=config.batuta_key.key;
      var url = "https://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY;

      Request.get(url, (error, response, body) => {
          if(error) {
              return console.dir(error);
          }
          var data = JSON.parse(body);
          // console.dir(JSON.parse(body));
          console.log(rows.category)
          res.render('business-owner/edit-business', {
            id:  rows[0].id,
            name_business:  rows[0].name, contact_no: rows[0].contact_no, email: rows[0].email, website: rows[0].website, description: rows[0].description, 
            address_id: rows[0]['address.id'],
            line1: rows[0]['address.line1'], line2: rows[0]['address.line2'],
            temp_state: rows[0]['address.administrative_area_1'], region: rows[0]['address.administrative_area_2'], city: rows[0]['address.administrative_area_3'],
            postal_code: rows[0]['address.postalcode'],
            lat: rows[0]['address.point'].coordinates[0], lng: rows[0]['address.point'].coordinates[1],
            active3: 'active',
            user: req.user[0], 
            valState: data,
            cat_id: rows[0].category,
            valCategories: row 
          })
      });
    })
  }).catch(err => {
    console.error(err);
  });
});

router.get('/edit-outlet', function(req, res, next) {
  res.render('business-owner/edit-outlet',{user: req.user[0]});
});

router.get('/list-business', function(req, res, next) {
  business.findAll({
  attributes: [
    'id',
    'name', 
    'email',
    [Sequelize.fn('GROUP_CONCAT', Sequelize.literal("categories.name SEPARATOR ', '")), 'category']
  ],
  group: ['business.id'],
  include: [{
    model: categories,
    // through: {
    //   attributes: ['category_id','business_id' ],
    // }
    }]
  }).then(rows => {
    res.render('business-owner/list-business', {  active2: 'active', data: rows, user: req.user[0]});
  }).catch(err => {
    console.error(err)
  })
});

router.post('/delete-business/:id', function(req, res, next) {
  business.destroy({ 
    where: {
      id: req.params.id
    },
    force: true })
  .then(() => {
    req.flash('success', 'Selected Business has been removed.')
    res.redirect('/business-owner/list-business');
  })
});

router.get('/list-outlets', function(req, res, next) {
  res.render('business-owner/list-outlets', { active3: 'active', user: req.user[0]});
});

router.get('/list-reviews', function(req, res, next) {
  res.render('business-owner/list-reviews', { active4: 'active',user: req.user[0]});
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