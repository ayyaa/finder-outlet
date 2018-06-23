var express = require('express');
var router = express.Router();
const models = require('../src/models');
const Sequelize = require('sequelize');
const twoFactor = require('node-2fa');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const async = require('async');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const moment = require('moment');
const multer = require('multer')
const categories = models.categories;
const business = models.business;
const business_categories = models.business_categories;
const users = models.users;
const outlets = models.outlets;
const address = models.address;
const days = models.days;
const reviews = models.reviews;
const validateJoi = require('../src/validation/joi-create-business');
const validateEditCp = require('../src/validation/joi-edit-cp');
const validateEditName = require('../src/validation/joi-edit-name');
const validateEditEmail = require('../src/validation/joi-edit-email');
const flash = require('connect-flash');
const config = require('../src/config/config')
const Request = require('request');
business.belongsToMany(categories, {through: 'business_categories', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_categories', foreignKey: 'category_id', otherKey: 'business_id'})
business_categories.belongsTo(business, {foreignKey: 'business_id'})
business.hasOne(business_categories, {foreignKey: 'business_id'})
business_categories.belongsTo(categories, {foreignKey: 'category_id'})
categories.hasOne(business_categories, {foreignKey: 'category_id'})
address.hasOne(business, {foreignKey: 'address_id'})
business.belongsTo(address, {foreignKey: 'address_id'})
outlets.belongsTo(business, {foreignKey: 'id_bussines'});
business.hasOne(outlets, {foreignKey: 'id_bussines'});
outlets.belongsTo(address, {foreignKey: 'id_address'});
address.hasOne(outlets, {foreignKey: 'id_address'});
days.belongsTo(outlets, {foreignKey: 'outlet_id'});
outlets.hasOne(days, {foreignKey: 'outlet_id'});
reviews.belongsTo(outlets, {foreignKey: 'outlet_id'});
outlets.hasOne(reviews, {foreignKey: 'outlet_id'});
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
            return next(new Error('file not supported'));
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
  // business.count({
  //   attributes: ['id'],
  //   where : {
  //     owner_id: req.user[0].id
  //   }
  // })
  // .then(num => {
  //   outlets.count({
  //     attributes: ['id'],
  //     include: [{
  //       model: business,
  //       where: {
  //         owner_id: req.user[0].id
  //       }
  //     }]
  //   })
  //   .then(num_of_outlets => {
  //     reviews.count({
  //       attributes : ['outlet_id'],
  //       group: 'outlet_id',
  //       where: {
  //         outlet_id: {[op.in]: [1, 2]},
  //       },
  //       include: [{
  //         attributes: ['id'],
  //         model: outlets,
  //         include: [{
  //           model: business,
            
  //           where: {
  //             owner_id: req.user[0].id
  //           }
  //         }]
  //       }],
  //     })
  //     .then(num_of_reviews => {
  //       console.log(num)
  //       console.log(num_of_reviews)
  //       console.log(num_of_outlets);
  //     })
  //   })
  // })
  business.findAndCountAll({
    where: {
      owner_id: req.user[0].id
    },
    attributes: [
      'id',
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col("outlet_id"))), 'count_outlet'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col("outlet->review.id"))), 'count_reviews']
    ],
    include: [{
      model: outlets,
      attributes: ['id'],
      include: [{
        model: reviews,
        attributes: ['id']
      }]
    }],
    distinct: true,
    raw:true
  })
  .then(rows => {
    console.log(rows)
    res.render('business-owner/dashboard', { 
      active1: 'active',
      'message': req.flash('message'),
      'info': req.flash('info'), 
      user: req.user[0],
      count_business: rows.count,
      count_outlet: rows.rows[0].count_outlet,
      count_reviews: rows.rows[0].count_reviews
    });
  });
  
});

var upload = multer(multerConfig).single('photo')

router.post('/upload',function(req,res,next){
  console.log('photooo =', req.file)
  upload(req, res, function (err) {
    if (err) {
      req.flash('error',err)
      res.redirect('/business-owner/account#nav-basic-info');
    }
    console.log(req.file.path)
    users.update(
      {
        temp_photo: req.user[0].photo,
        photo: req.file.filename
      }
    , {
        where: {
          id: [req.user[0].id]
        }
      }
    )
    .then(rows => {
      console.log(req.user[0].temp_photo)
      console.log(req.body.name)
      if(req.user[0].photo != 'photo-1527578948144.png') {
        fs.unlink('./public/photo-storage/'+req.user[0].photo, (err) => {
          if (err) throw err;
          console.log(req.user[0].photo, ' deleted')
          res.redirect('/business-owner/account#nav-basic-info');
        }) 
      } else {
        res.redirect('/business-owner/account#nav-basic-info');
      }
    }).catch(err => {
      console.error(err)
      res.send('error')
    })
  })
});

router.post('/upload-picture=:id',function(req,res,next){
  console.log('photooo =', req.file)
  upload(req, res, function (err) {
    if (err) {
      req.flash('error',err)
      res.redirect('/business-owner/edit-picture');
    }
    console.log(req.file.path)
    business.findAll(
      {
        where: {
          id: [req.params.id],
          [op.and]: {owner_id: req.user[0].id}
        }
      }
  ).then(bs => {
      business.update(
        {
          image: req.file.filename,
          temp_image: bs[0].image
        },
        {
          where: {
            id: [req.params.id],
            [op.and]: {owner_id: req.user[0].id}
          }
        }
      )
      .then(rows => {
        business.findAll({
          where: {
            id: [req.params.id],
            [op.and]: {owner_id: req.user[0].id}
          }
        }).then(rows2 => {
          console.log(rows2[0].temp_image)
          if(rows2[0].temp_image != 'photo-1528731585876.png') {
            fs.unlink('./public/photo-storage/'+rows2[0].temp_image, (err) => {
              if (err) throw err;
              console.log(rows2[0].temp_image, ' deleted')
              res.redirect('/business-owner/edit-picture='+rows2[0].id);
            }) 
          } else {
            res.redirect('/business-owner/edit-picture='+rows2[0].id);
          }
        })
      }).catch(err => {
        console.error(err)
        res.send('error')
      })
    })
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
  
  if (Array.isArray(req.body.get_category) === false) {
    var category = [];
    category.push(req.body.get_category)
  } else {
    var category = req.body.get_category;
  }
  console.log(category);
  console.log(Array.isArray(req.body.get_category));
  validateJoi.validate({
    get_category: category,
    contact_no: req.body.contact_no, 
    name_business: req.body.name_business, 
    email: req.body.email, 
    website: req.body.website, 
    description: req.body.description, 
    line1: req.body.line1, 
    line2: req.body.line2,
    state: req.body.state, 
    region: req.body.region, 
    city: req.body.city, 
    postal_code: req.body.postal_code, 
    lat: req.body.lat, 
    lng: req.body.lng}, function(errors, value) {
    console.log(errors);
    if (!errors) {
      console.log(req.body.city)
      console.log(req.body.region)
      address.create({
        line1: req.body.line1, 
        line2: req.body.line2,
        administrative_area_1: req.body.state, 
        administrative_area_2: req.body.region, 
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
          description: req.body.description
        })
        .then(rowss => {
          var length_of_category = req.body.get_category;
          length_of_category = length_of_category.length;
          for( var x = 0 ; x < length_of_category ; x++ ) {
            business_categories.create({
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
        var BATTUTA_KEY=config.batuta_key.key;
        var url = "https://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY;

        Request.get(url, (error, response, body) => {
          if(error) {
              return console.dir(error);
          }
          var data = JSON.parse(body);
          req.flash('error', errors);
          res.render('business-owner/create-business', {
            active3: 'active', 
            valCategories:rows, 
            valState: data, 
            error: req.flash('error'), 
            user: req.user[0],
            name_business: req.body.name_business,
            email: req.body.email,
            website: req.body.website,
            contact_no: req.body.contact_no,
            description: req.body.description,
            state: req.body.state,
            region: req.body.region,
            city: req.body.city,
            postal_code: req.body.postal_code,
            line1: req.body.line1,
            line2: req.body.line2,
            lat: req.body.lat,
            lng: req.body.lng,
            lat1: req.body.lat1,
            lat2: req.body.lng
          });
        });    
      })
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
    var BATTUTA_KEY=config.batuta_key.key;
    var url = "https://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY;

    Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var data = JSON.parse(body);
        // console.dir(JSON.parse(body));
        // console.log(data[1].name)
      console.log(rows)
      res.render('business-owner/create-outlet',{active3: 'active',user: req.user[0], valBusiness: rows, valState: data, api_key: BATTUTA_KEY });
  
    })
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

router.post('/editname', function(req, res, next) {
  validateEditName.validate({
    name: req.body.name
  }, function(errors, value) {
    if(!errors) {
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
        res.redirect('/business-owner/account#nav-basic-info')
      })
    } else {
      req.flash('error','<div class="alert alert-danger"><div class="text-center">'+errors+'</div></div>')
      res.redirect('/business-owner/account#nav-basic-info')
    }
  })
})

router.post('/checkemail', function(req, res, next) {
  console.log(req.body.email)
  users.findAll(
    {
      where: {
        email: req.body.email
      }
    }
  ).then(rows => {
    if(rows.length>0) {
      res.send(false)
    } else {
      res.send(true)
    }
  })
})

router.post('/editcp', function(req, res, next) {
  validateEditCp.validate({
    cp: req.body.phone
  }, function(errors, value) {
    if(!errors) {
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
        res.redirect('/business-owner/account#nav-basic-info')
      })
    } else {
      console.log(errors)
      req.flash('error','<div class="alert alert-danger"><div class="text-center">'+errors+'</div></div>')
      res.redirect('/business-owner/account#nav-basic-info')
    }
  })
})

router.post('/editemail', function(req, res, next) {
  validateEditEmail.validate({
    cp: req.body.email
  }, function(errors, value) {
    if(!errors) {
      if(req.body.email === req.user[0].email) {
        res.redirect('/business-owner/account#nav-basic-info')
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
          res.redirect('/business-owner/account#nav-basic-info')
        });
      }
    } else {
      req.flash('error','<div class="alert alert-danger"><div class="text-center">'+errors+'</div></div>')
      res.redirect('/business-owner/account#nav-basic-info')
    }
  })
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
      res.redirect('/business-owner/account#nav-basic-info')
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
        res.redirect('/business-owner/account#nav-basic-info')
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

router.post('/refresh_sk/:id', function(req, res, next) {
  users.findOne({
    where: {
      id: [req.params.id]
    }
  }).then(rows => {
    var nsecret = twoFactor.generateSecret({name: 'Outlet Finder', account: rows.username});
    users.update({
      fa_key: nsecret.secret,
      url_qr: nsecret.qr
    }, {where: {
      id: [req.params.id]
    }}).then(rows => {
      res.send('success')
    }).catch(err => {
      console.error(err)
      res.send('error')
    })
  })
});

router.get('/account', function(req, res, next) {
  if(req.user[0].fa_status === 1) {
    var auth = true
  } else {
    var auth = false
  }
  // console.log(auth)
  res.render('business-owner/account', {user: req.user[0], vauth: auth, 'info' : req.flash('info'), 'message' : req.flash('message'), error : req.flash('error')});
});

// router.get('/edit-business=:id', function(req, res, next) {
//   business_categories.findAll({
//     attributes: [
//       'category_id'
//     ],
//     where: {
//       business_id: req.params.id
//     }
//   })
//   .then(business_categories => {
//     // console.log(business_categories)
//     var category = business_categories.category_id;
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
//         console.log(business_categories);
//         console.log(business);
//         console.log(address);

//       })
//     })
//   })
// });

router.get('/edit-business=:id', function(req, res) {
  business.findAll({
    where: {
      id: [req.params.id],
      [op.and]: {owner_id: req.user[0].id}
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
  //     model: business_categories,
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
    if(rows.length <= 0) {
      res.render('access-denied');
      return false;
    }
    categories.findAll()
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
    .catch(err => {
    res.render('error')
    });
  })
  .catch(err => {
  res.render('error')
  });
});

router.get('/edit-picture=:id', function(req, res, next) {
  business.findOne({
    where: {
      id: [req.params.id],
      [op.and]: {owner_id: req.user[0].id}
    }
  }).then(rows => {
    res.render('business-owner/edit-picture',{user: req.user[0], data: rows});
  })
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
      'image',
      [Sequelize.fn('GROUP_CONCAT', Sequelize.literal("DISTINCT(categories.name) SEPARATOR ', '")), 'category']
    ],
    group: ['business.id'],
    order: [
      ['id','DESC']
    ],
    include: [
      {
      model: categories,
      attributes: [
        [Sequelize.literal('COUNT(DISTINCT(outlet.id))'), 'countoutlet']
      ],
      },
      {
        model: outlets,
        group: ['business.id']
      }
    ]
  })
  .then(rows => {
    res.render('business-owner/list-business', {  active2: 'active', data: rows, user: req.user[0]});
  }).catch(err => {
    console.error(err)
  })
});

router.post('/delete-business/:id', function(req, res, next) {
  business.destroy({ 
    where: {
      id: req.params.id,
      [op.and]: {owner_id: req.user[0].id}
    },
    force: true })
    .then(() => {
      res.send(true)
    })
    .catch(err => {
      res.send(false)
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
    order: [
      ['id','DESC']
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
      console.log(rows)
      res.render('business-owner/list-outlets', {  active3: 'active', user: req.user[0], data: rows});
    }).catch(err => {
      console.error(err)
    })
});


function time(a) {
  var sat = ['years','months','days','hours','minutes','seconds']
  for(var i = 0; i < sat.length; i++) {
    var k = moment().diff(a, sat[i]);
    if(k !== 0) {
       var arr = `${k} ${sat[i]} ago`;
       break;
    }

  }
  return arr
}

router.get('/list-reviews', function(req, res, next) {
  reviews.findAll({
    order: [
      ['id','DESC']
    ],
    include: {
      required: false,
      model: outlets,
      attributs : [
        'name', 'id'
      ],
      include: {
        required: false,
        model: business,
      }
    },
    where: {
      '$outlet->business.owner_id$': req.user[0].id,
    }
  }).then(rev => {
    var tim2 =[]
    for(var i = 0 ; i <rev.length; i++) {
      var m = time(rev[i].created_at)
      var tim = {}
      tim.rev = rev[i];
      tim.date = m;
      tim2.push(tim)
    }
    res.render('business-owner/list-reviews', { active4: 'active',user: req.user[0], review: tim2, time_info: tim});
  })
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