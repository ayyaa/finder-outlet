var express = require('express');
var router = express.Router();
const models = require('../src/models');
const Sequelize = require('sequelize');
const twoFactor = require('node-2fa');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const async = require('async');
const sgMail = require('@sendgrid/mail');
const multer = require('multer')
const categories = models.categories;
const business = models.business;
const business_category = models.business_category;
const users = models.users;
const outlets = models.outlets;
const address = models.address;
const validateJoi = require('../src/validation/joi-create-business');
const flash = require('connect-flash');
const config = require('../src/config/config')
const Request = require('request');
business.belongsToMany(categories, {through: 'business_category', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_category', foreignKey: 'category_id', otherKey: 'business_id'})
address.hasOne(business, {foreignKey: 'address_id'})
business.belongsTo(address)
outlets.belongsTo(business, {foreignKey: 'id_bussines'});
business.hasOne(outlets, {foreignKey: 'id_bussines'});
outlets.belongsTo(address, {foreignKey: 'id_address'});
address.hasOne(outlets, {foreignKey: 'id_address'});
const op = Sequelize.Op

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
          owner_id: 1,
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
  res.render('business-owner/create-outlet',{user: req.user[0]});
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

router.post('/editname', function(req, res, next) {
  users.update(
    {
      name: req.body.name
    },
    {
      where: {
        id: [req.user[0].id]
      }
    }
  ).then(rows => {
    res.redirect('/business-owner/account')
  })
})



router.post('/editcp', function(req, res, next) {
  users.update(
    {
      contact_no: req.body.phone
    },
    {
      where: {
        id: [req.user[0].id]
      }
    }
  ).then(rows => {
    res.redirect('/business-owner/account')
  })
})

router.post('/editemail', function(req, res, next) {
  if(req.body.email === req.user[0].email) {
    res.redirect('/business-owner/account')
  } else {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },

      function(token, done) {
        var user = {username: req.body.username, email: req.body.email, reg_token: token, status: 0}
        users.update(
          {
            temp_email: req.body.email,
            reg_token: token
          },
          {
            where: {
              id: [req.user[0].id]
            }
          }
        ).then(function(rows, err) {
          users.findAll({
            where: {
              id: [req.user[0].id]
            }
          }).then(function(rows, err) {
            done(err, token, rows)
          })
        })
      },
      
      function(token, rows, done) {
        console.log('email',req.body.email)
        var msge = {
          to: req.body.email,
          from: 'outlet_finder@example.com',
          subject: 'Confirm your email',
          text: 'Hello.\n\n' + req.user[0].name + ' !' +
          'You have updated your email address to:' + req.body.email + '\n\n' +
          'Confirm your email address to get started and discover your moments with the world' + '\n\n' +
          ' http://' + req.headers.host + '/business-owner/active/' + token + '\n\n' +
          'If you did not request this, please ig-nore this email.\n',
        };
        sgMail.send(msge, function(err) {
          console.log('success')
          req.flash('info', '<div class="alert alert-success"><div class="text-center">We have sent a confirmation to ' + req.body.email + ' to make sure its valid email address. Your ad account contact info will be updated once you have confirmed your email address. If you dont receive this email, check your spam folder.</div></div>')
          done(err, 'done');
        });
      }
    ], 
    function(err) {
      if (err) return next(err);
      res.redirect('/business-owner/account')
    });
  }
})

router.get('/active/:token', function(req, res) {
  users.findAll({
    where: {
      reg_token: [req.params.token],
      [op.and]: {id: req.user[0].id}
    }
  }).then(function(rows, err) {
    if (rows.length<=0) {
      req.flash('message','<div class="alert alert-danger"><div class="text-center">invalid token or link is broken</div></div>')
      res.redirect('/business-owner/account')
    } else {
      users.update(
        {
          email: req.user[0].temp_email,
          reg_token: ''
        },
        {
          where: {
            reg_token: [req.params.token],
            [op.and]: {id: req.user[0].id}
          }
        }
      ).then(rows => {
        req.flash('info','<div class="alert alert-success"><div class="text-center">email has been updated</div></div>')
        res.redirect('/business-owner/account')
      }).catch(function(err) {
        console.log(err)
      })
    }
  }).catch(function(err) {
    console.log(err)
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
  res.render('business-owner/account', {user: req.user[0], vauth: auth, 'info' : req.flash('info'), 'message' : req.flash('message')});
});

router.get('/edit-business', function(req, res, next) {
  res.render('business-owner/edit-business',{user: req.user[0]} );
});

router.get('/edit-outlet', function(req, res, next) {
  res.render('business-owner/edit-outlet',{user: req.user[0]});
});

router.get('/list-business', function(req, res, next) {
  business.findAll({
    where: {
      owner_id: req.user[0].id
    },
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
  console.log(req.user[0].id)
  outlets.findAll({
    // where: {
    //   owner_id: req.user[0].id
    // },
    attributes: [
      'id',
      'name', 
    ],
    include: [
      {
      model: business,
      where: {
        owner_id: req.user[0].id
      },
      attributes: [
        'name'
      ],
      },
      {
        model: address,
        attributes: [
          'administrative_area_2'
        ],
      }
    ]
    }).then(rows => {
      res.render('business-owner/list-outlets', {  active3: 'active', user: req.user[0], data: rows});
    }).catch(err => {
      console.error(err)
    })
});

router.get('/list-outlets=:id', function(req, res, next) {
  outlets.findAll({
    where: {
      id_bussines: req.params.id
    },
    attributes: [
      'id',
      'name', 
    ],
    include: [
      {
      model: business,
      where: {
        owner_id: req.user[0].id
      },
      attributes: [
        'name'
      ],
      },
      {
        model: address,
        attributes: [
          'administrative_area_2'
        ],
      }
    ]
    }).then(rows => {
      console.log(rows[0].dataValues.business.name)
      res.render('business-owner/list-outlets', {  active3: 'active', user: req.user[0], data: rows, business: rows[0].dataValues.business.name });
    }).catch(err => {
      console.error(err)
    })
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