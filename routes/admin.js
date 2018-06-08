var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const models = require('../src/models');
const twoFactor = require('node-2fa');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const async = require('async');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const fs = require('fs');
const categories = models.categories;
const business = models.business;
const business_categories = models.business_categories;
const users = models.users;
const outlets = models.outlets;
const address = models.address;
const reviews = models.reviews;
const validateJoi = require('../src/validation/joi-create-category');
const flash = require('connect-flash');

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

business.belongsToMany(categories, {through: 'business_categories', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_categories', foreignKey: 'category_id', otherKey: 'business_id'})
outlets.belongsTo(business, {foreignKey: 'id_bussines'});
business.hasOne(outlets, {foreignKey: 'id_bussines'});
outlets.belongsTo(address, {foreignKey: 'id_address'});
address.hasOne(outlets, {foreignKey: 'id_address'});
reviews.belongsTo(outlets, {foreignKey: 'outlet_id'});
outlets.hasOne(reviews, {foreignKey: 'outlet_id'});
// address.hasOne(business, {foreignKey: 'address_id'})
// business.belongsTo(address, {foreignKey: 'address_id'})

router.get('/dashboard', function(req, res, next) {
  business.findAll({
    attributes: [
      'id',
      'name', 
      'email',
      [Sequelize.fn('GROUP_CONCAT', Sequelize.literal("DISTINCT(categories.name) SEPARATOR ', '")), 'category']
    ],
    group: ['business.id'],
    limit: 5,
    subQuery: false,
    include: [
      {
        model: categories,
        attributes: [
          [Sequelize.literal('COUNT(DISTINCT(outlet.id))'), 'countoutlet']
        ]
      },
      {
        model: outlets,
        group: ['business.id']
      }
    ]
  })
  .then(rows1 => {
    outlets.findAll({
      attributes: [
        'id',
        'name', 
      ],
      limit: 5,
      include: [
        {
          model: business,
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
    }).then(rows2 => {
      business.findAndCountAll({
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
      .then(rows3 => {
        categories.count()
        .then(rows4 => {
          console.log('xxxxxxxxxxxxxxx'+rows4)
          console.log(rows1[0].dataValues.categories[0].countoutlet)
          res.render('admin/dashboard', { 
            title: 'Express' , 
            active1: 'active',
            'message': req.flash('message'),
            'info': req.flash('info'), 
            user: req.user[0],
            data: rows1,
            data2: rows2,
            count_categories: rows4,
            count_business: rows3.count,
            count_outlets:rows3.rows[0].count_outlet,
            count_reviews:rows3.rows[0].count_reviews
          });
        })
      })
    }).catch(err => {
      console.error(err)
    })
  }).catch(err => {
    console.error(err)
  })
});

router.post('/upload',multer(multerConfig).single('photo'),function(req,res){
  console.log(req.file.path)
  users.update(
    {
      photo: req.file.filename
    }
  , {
      where: {
        id: [req.user[0].id]
      }
    }
  )
  .then(rows => {
    console.log(req.user[0].photo)
    if(req.user[0].photo !== 'photo-1527578948144.png') {
      fs.unlink('./public/photo-storage/'+req.user[0].photo, (err) => {
        if (err) throw err;
        res.redirect('/admin/account#nav-basic-info');
      }) 
    } else {
      res.redirect('/admin/account#nav-basic-info');
    }
 }).catch(err => {
    console.error(err)
    res.send('error')
  })
})

router.get('/list-categories', function(req, res, next) {
  categories.findAll()
  .then(rows => {
    console.log(rows);
    // res.render('admin_list', {title: 'User List', data: rows, nameTag: req.user.user});
    res.render('admin/list-categories', { active2: 'active', data: rows, user: req.user[0], 'success': req.flash('success'), 'error': req.flash('error')});
  })
  .catch(() => {
    res.status(500).json({"status_code": 500,"status_message": "internal server error"});
  })
});

router.get('/create-category', function(req, res, next) {
  res.render('admin/create-category', {user: req.user[0], error: req.flash('error')});
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
        if (rows) {
          console.log(rows)
          req.flash('error', '<div class="alert alert-danger"><div class="text-center">Duplicate entry namen</div></div>');
          res.redirect('/admin/create-category')
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
      .catch(err => {
        console.log(err)
      })
      
    } else {
      req.flash('error', '<div class="alert alert-danger"><div class="text-center">'+errors+'</div></div>');
      res.redirect('/admin/create-category')
    } 
  })
});

router.get('/edit-category=:id', function(req, res, next) {
  categories.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(rows => {
    console.log(rows)
    if(rows.length <= 0) {
      req.flash('error', 'categories not found with id '+ [req.params.id]);
      res.redirect('/admin/list-categories');
    } else {
      res.render('admin/edit-category', {
        id: rows[0].id,
        name_category: rows[0].name,
        description: rows[0].description
        , user: req.user[0],
        active2: 'active'
      });
    }
  })
});

router.post('/update-category', function(req, res, next) {
  validateJoi.validate({name_category: req.body.name_category, description: req.body.description}, function(errors, value) {
    console.log(errors);
    if (!errors) {
      categories.findOne({
        attributes: ['name'],
        where: {
          id: req.body.id
        }
      })
      .then(rows => {
        console.log(rows)
        console.log(req.body.name_category)
        categories.update({ 
          name: req.body.name_category,
          description: req.body.description 
        }, { 
          where : {
            id: req.body.id
          }
        })
        .then(rows => {
          req.flash('success', 'Successful update categories.');
          res.redirect('/admin/list-categories');
          console.log(rows);
        })
      })
      
    } else {
      req.flash('error', errors);
      res.render('admin/edit-category', {
        error: req.flash('error'),
        id: req.body.id,
        name_category:  req.body.name_category,
        description: req.body.description
        , user: req.user[0]
      });
    } 
  })
});

router.post('/delete-category=:id', function(req, res, next) {
  categories.destroy({ 
    where: {
      id: req.params.id
    },
    force: true })
  .then(() => {
    res.send(true)
  })
  .catch(err => {
    res.send(false)
  })
});

router.get('/account', function(req, res, next) {
  if(req.user[0].fa_status === 1) {
    var auth = true
  } else {
    var auth = false
  }
  // console.log(auth)
  res.render('admin/account', {user: req.user[0], vauth: auth});
})

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
    res.redirect('/admin/account#nav-basic-info')
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
    res.redirect('/admin/account#nav-basic-info')
  })
})



router.post('/editemail', function(req, res, next) {
  if(req.body.email === req.user[0].email) {
    res.redirect('/admin/account#nav-basic-info')
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
          ' http://' + req.headers.host + '/admin/active/' + token + '\n\n' +
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
      res.redirect('/admin/account#nav-basic-info')
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
      res.redirect('/admin/account#nav-basic-info')
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
        res.redirect('/admin/account#nav-basic-info')
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

router.get('/list-business', function(req, res, next) {
  business.findAll({
    attributes: [
      'id',
      'name', 
      'email',
      // 'website',
      // 'contact_no',
      // 'description',
      [Sequelize.fn('GROUP_CONCAT', Sequelize.literal("DISTINCT(categories.name) SEPARATOR ', '")), 'category']
    ],
    group: ['business.id'],
    include: [
      {
      model: categories,
      attributes: [
        'name',
        [Sequelize.literal('COUNT(DISTINCT(outlet.id))'), 'countoutlet']
        ],
      },
      {
        model: outlets,
        group: ['business.id']
      },
      // {
      //   model: address,
      //   attributes: [
      //     [Sequelize.fn('CONCAT', Sequelize.col("line1"),', ', Sequelize.col("line2"), ', ',Sequelize.col("administrative_area_1"),', ', Sequelize.col("administrative_area_1"), ', ',Sequelize.col("administrative_area_3"),', ', Sequelize.col("administrative_area_4"), ', ', Sequelize.col("postalcode")), 'address']
      //   ]
      // }
    ]
  })
  .then(rows => {
    console.log(rows)
    for(var i = 0; i< rows.length; i++) {
      console.log(rows[i].dataValues.categories[0].dataValues.countoutlet)
    }
    // console.log(rows[0].dataValues.categories)
    res.render('admin/list-business', {  active3: 'active', data: rows, user: req.user[0]});
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
    res.redirect('/admin/list-business');
  })
});

router.get('/list-report-reviews', function(req, res, next) {
  res.render('admin/list-report-reviews', {  active7: 'active', user: req.user[0]});
});

router.get('/list-business-owner', function(req, res, next) {
  users.findAll({ 
    where: {
      role: 'BUSINESS OWNER'
    }
  })
  .then(rows => {
    console.log(rows[0]);
    // res.render('admin_list', {title: 'User List', data: rows, nameTag: req.user.user});
    res.render('admin/list-bo', {  active4: 'active', data: rows, user: req.user[0]});
    // res.render('admin/list-categories', { active2: 'active', data: rows});
  })
 
});

router.get('/list-outlets', function(req, res, next) {
  outlets.findAll({
    attributes: [
      'id',
      'name', 
    ],
    include: [
      {
        model: business,
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
    res.render('admin/list-outlets', {  active5: 'active', user: req.user[0], data: rows});
  }).catch(err => {
    console.error(err)
  })
});


router.get('/list-reviews', function(req, res, next) {
  res.render('admin/list-reviews', {  active6: 'active', user: req.user[0]});
});


router.post('/logout', function (req, res) {
  if(!req.isAuthenticated()) {
     notFound404(req, res, next);
  } else {
     req.logout();
     res.redirect('/login');
  }
})

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
      res.render('admin/list-outlets', {  active5: 'active', user: req.user[0], data: rows});
    }).catch(err => {
      console.error(err)
    })
});

module.exports = router;
