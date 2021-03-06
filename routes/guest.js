const express = require('express');
const router = express.Router();
const flash  = require('connect-flash');
const crypto = require('crypto');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const models = require('../src/models');
const twoFactor = require('node-2fa');
const Libur = require('libur');
const users = models.users
const categories = models.categories;
const business = models.business;
const business_categories = models.business_categories;
const outlets = models.outlets;
const address = models.address;
const days = models.days;
const reviews = models.reviews;
const review_reports = models.review_reports;
const validateEditEmail = require('../src/validation/joi-edit-email');
const Sequelize = require ('sequelize');
const regValidate= require('../src/validation/joi-registration');
const regcValidate = require('../src/validation/joi-cmplt-reg');
const op = Sequelize.Op;
const libur = new Libur();


business.belongsToMany(categories, {through: 'business_categories', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_categories', foreignKey: 'category_id', otherKey: 'business_id'})
outlets.belongsTo(business, {foreignKey: 'id_bussines'});
business.hasOne(outlets, {foreignKey: 'id_bussines'});
outlets.belongsTo(address, {foreignKey: 'id_address'});
address.hasOne(outlets, {foreignKey: 'id_address'});
days.belongsTo(outlets, {foreignKey: 'outlet_id'});
outlets.hasOne(days, {foreignKey: 'outlet_id'});
reviews.belongsTo(outlets, {foreignKey: 'outlet_id'});
outlets.hasOne(reviews, {foreignKey: 'outlet_id'});
review_reports.belongsTo(reviews, {foreignKey: 'review_id'});
reviews.hasOne(review_reports, {foreignKey: 'review_id'});
address.hasOne(business, {foreignKey: 'address_id'})
business.belongsTo(address, {foreignKey: 'address_id'})
outlets.belongsTo(address, {foreignKey: 'id_address'});
address.hasOne(outlets, {foreignKey: 'id_address'});

/* GET home page. */
router.get('/', function(req, res, next) {
  var location = [];
  outlets.findAll({
    attributes: [
      'id',
      'name'
    ],
    include: {
      model: address,
      attributes: [
        [Sequelize.fn('X', Sequelize.col('point')), 'lat'], [Sequelize.fn('Y', Sequelize.col('point')), 'long']
      ]
    }
  })
  .then(rows => {
    address.findAll({
      group: 'administrative_area_3'
    }).then(rows1 => {
      categories.findAll()
      .then(rows2=> {
        for(var i = 0 ; i < rows.length; i++) {
          var as = []
          as.push(rows[i].name, rows[i].address.dataValues.lat, rows[i].address.dataValues.long, i, 'http://localhost:3000/outletinfo='+rows[i].id)
          location.push(as)
        }
        console.log(location)
        res.render('guest/home', { title: 'Express', data: JSON.stringify(location), city: rows1, cat: rows2});
      })
    })
  })
});

users.findAll().then(rows => {
  console.log('success users')
})

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// select distinct(`category_id`)
// from `outlets` 
// inner join `business` on `outlets`.`id_bussines` = `business`.`id`
// inner join `business_categories` on `business_categories`.`business_id` = `business`.`id`
// where business_id = 1

outlets.findAll({
  where: {
    id_bussines: '1'
  },
  include: [
    {
      model: business,
      include: [
        {
          model: business_categories
        }
      ]
    }
  ],
  group: ['business->business_category.category_id']
}).then(rows => {
    outlets.findAll({
    where: {
      id_bussines: [rows[0].business.business_category.category_id, rows[1].business.business_category.category_id, rows[2].business.business_category.category_id]
    },
    include: [
      {
        model: business,
        include: [
          {
            model: business_categories
          }
        ]
      },
      {
        model: address,
        attributes: [
          [Sequelize.fn('X', Sequelize.col('point')), 'lat'], [Sequelize.fn('Y', Sequelize.col('point')), 'long']
        ]
      }
    ],
    group: ['outlets.id']
  })
  .then(rows2=>{
    var location = [];
    for(var i = 0 ; i < rows2.length; i++) {
      var as = []
      as.push(rows2[i].name, rows2[i].address.dataValues.lat, rows2[i].address.dataValues.long, i, 'http://localhost:3000/outletinfo='+rows2[i].id)
      location.push(as)
    }
    console.log(location)
  })
})

router.get('/login', function(req, res){
  if (req.isAuthenticated()) {
    if (req.user[0].role === 'BUSINESS OWNER') {
      req.flash('message' ,'<div class="alert alert-danger"><div class="text-center">You have been logged in</div></div>')
      res.redirect('/business-owner/dashboard')
    } else {
      req.flash('message' ,'<div class="alert alert-danger"><div class="text-center">You have been logged in</div></div>')
      res.redirect('/admin/dashboard')
    }
  } else {
  res.render('guest/login',{'message' :req.flash('message'),'success' :req.flash('success')});
  };
});

console.log(moment().format())

router.get('/signin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    users.findAll({
      where: {
        [op.or]: [{username: [req.query.username]}, {email: [req.query.username]}]
      }
    }).then(function(rows) {
      console.log(rows[0].fa_status)
      if (rows[0].fa_status == 0) {
        req.logIn(user, function(err) {
          users.update({
            last_login: moment().format()
          },{
            where: {
              username: [req.query.username]
            }
          }).then(rows => {
            if (err) { return next(err); }
            console.log(user.role)
            if(user.role === 'BUSINESS OWNER') {
              var role = 'Business Owner'
              req.flash('info', '<div class="alert alert-success"><div class="text-center">Welcome to Outlet Finder as '+role+' '+user.username+ '!</div></div>');
              return res.redirect('/business-owner/dashboard');
            } else {
              var role = 'Admin'
              req.flash('info', '<div class="alert alert-success"><div class="text-center">Welcome to Outlet Finder as ' +role+' '+user.username+ '!</div></div>');
              return res.redirect('/admin/dashboard');
            }
          })
        });
      } else {
        req.flash('username',req.query.username)
        res.redirect('/two_fa/')
      }
    })
  })(req, res, next);
});

router.get('/two_fa/', function(req, res) {
  // console.log('username ',req.params.username )
   var f = req.flash('username');
   console.log(f.toString())
   res.render('guest/two_fa', {susername: f.toString()})
  //  users.findAll({
  //    where: {
  //      username: [f.toString()]
  //    }
  //  }).then(function(rows) {
  //    console.log(twoFactor.generateToken(rows[0].secretkey))
  //  })
 })

 router.post('/two_fa/', function(req, res) {
  console.log(req.body.username)
  users.findAll({
    where: {
      username: [req.body.username]
    }
  }).then(function(rows) {
    var verifytoken = twoFactor.verifyToken(rows[0].fa_key, req.body.token);
    console.log(req.body.token)
    var newToken = twoFactor.generateToken(rows[0].fa_key)
    console.log(newToken)
    if (verifytoken !== null) {
      users.findOne({
        where: {
          username: [req.body.username]
        },
        attributes: ['id', 'username', 'password']
      }).then(user => 
        req.login(user, function (err) {
          if (err) { return next(err); }
          console.log(user.role)
          if(user.role === 'BUSINESS OWNER') {
            var role = 'Business Owner'
            req.flash('info', '<div class="alert alert-success"><div class="text-center">Welcome to Outlet Finder as '+role+' '+user.username+ '!</div></div>');
            return res.redirect('/business-owner/dashboard');
          } else {
            var role = 'Admin'
            req.flash('info', '<div class="alert alert-success"><div class="text-center">Welcome to Outlet Finder as ' +role+' '+user.username+ '!</div></div>');
            return res.redirect('/admin/dashboard');
          }
        })
      ) 
    } else {
      req.flash('failed','<div class="alert alert-danger"><div class="text-center">wrong token, try again !</div></div>')
      res.render('guest/two_fa',{'error': req.flash('failed'),stoken: req.body.token, susername: req.body.username})
    }
  }).catch(error => {
    req.flash('failed','<div class="alert alert-danger"><div class="text-center">wrong token, try again !</div></div>')
    res.render('guest/two_fa',{'error': req.flash('failed'),stoken: req.body.token, susername: req.body.username})
  })
})

// router.get('/signin', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       console.log(user.role)
//       if(user.role === 'BO') {
//         var role = 'Business Owner'
//         req.flash('info', '<div class="alert alert-success"><div class="text-center">Welcome to Outlet Finder as '+role+' '+user.username+ '!</div></div>');
//         return res.redirect('/business-owner/dashboard');
//       } else {
//         var role = 'Admin'
//         req.flash('info', '<div class="alert alert-success"><div class="text-center">Welcome to Outlet Finder as ' +role+' '+user.username+ '!</div></div>');
//         return res.redirect('/admin/dashboard');
//       }
//     });
//   })(req, res, next);
// });


router.get('/regist', function(req, res){
  if (req.isAuthenticated()) {
    if (req.user[0].role === 'BUSINESS OWNER') {
      req.flash('message' ,'<div class="alert alert-danger"><div class="text-center">You have been logged in</div></div>')
      res.redirect('/business-owner/dashboard')
    } else {
      req.flash('message' ,'<div class="alert alert-danger"><div class="text-center">You have been logged in</div></div>')
      res.redirect('/admin/dashboard')
    }
  } else {
  res.render('guest/regist', {'error' :req.flash('error'), 'info' :req.flash('info')});
  };
});

router.post('/regist', function(req,res) {
  regValidate.validate({ username: req.body.username , email: req.body.email}, function(err, value) {
    if (err) {
      req.flash('error', '<div class="alert alert-danger"><div class="text-center">'+err+'</div></div>')
      var susername = req.body.username;
      var semail = req.body.email;
      res.render('guest/regist', {'error' :req.flash('error'), susername, semail});
    } else {
      users.findAll({
        where: {
          username: [req.body.username]
        }
      }).then(function(rows) {
        if (rows.length > 0) {
          req.flash('error','<div class="alert alert-danger"><div class="text-center">Username is not available</div></div>')
          var susername = req.body.username;
          var semail = req.body.email;
          res.render('guest/regist', {'error' :req.flash('error'), susername, semail});
        } else {
          users.findAll({
            where: {
              email: [req.body.email]
            }
          }).then(function(rows) {
            if (rows.length > 0) {
              req.flash('error', '<div class="alert alert-danger"><div class="text-center">Email has been used</div></div>')
              var susername = req.body.username;
              var semail = req.body.email;
              res.render('guest/regist', {'error' :req.flash('error'), susername, semail});
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
                  users.bulkCreate([
                    user
                  ]).then(function(rows, err) {
                    users.findAll({
                      where: {
                        username: req.body.username
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
                    from: 'azz@example.com',
                    subject: 'Confirm your account',
                    text: 'By clicking on the following link, you are confirming your email address and complete your registration.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/confirmreg/' + token + '\n\n' +
                    'If you did not request this, please ig-nore this email.\n',
                  };
                  sgMail.send(msge, function(err) {
                    console.log('success')
                    req.flash('info', '<div class="alert alert-success"><div class="text-center">An e-mail has been sent to ' + req.body.email + ' to confirm your account. Check it, and complete your registration</div></div>');
                    done(err, 'done');
                  });
                }
              ], 
              function(err) {
                if (err) return next(err);
                res.redirect('/regist')
              });
            }
          })
        }
      })
    }
  })  
})

router.get('/confirmreg/:token', function(req, res) {
  users.findAll({
    where: {
      reg_token: [req.params.token]
    }
  }).then(function(rows, err) {
    if (rows.length<=0) {
      req.flash('error','<div class="alert alert-danger"><div class="text-center">invalid token or link is broken</div></div>')
      res.redirect('/regist')
    } else {
      res.render('guest/complete_regist', {susername: rows[0].username, semail: rows[0].email, 'error' : req.flash('error')})
    }
  }).catch(function(err) {
    console.log(err)
  })
})

router.post('/confirmreg/:token', function(req, res, next) {
  var pass = bcrypt.hashSync(req.body.password);
  var nsecret = twoFactor.generateSecret({name: 'Outlet Finder', account: req.body.username});
  var user = {password: pass, reg_token: '', status: 1, fa_key: nsecret.secret, url_qr: nsecret.qr}
  regcValidate.validate({ password: req.body.password}, function(error, value) {
    if (error) {
      req.flash('error', '<div class="alert alert-danger"><div class="text-center">'+error+'</div></div>')
      res.render('guest/complete_regist', {susername: req.body.username, semail: req.body.email, 'error' :req.flash('error')})
    }
    users.update(
      user,
      { where: {
        username: req.body.username
      }}
    ).then(rows => 
      users.findOne({
        where: {
          username: [req.body.username]
        },
        attributes: ['id', 'username', 'password']
      }).then(user => 
        req.login(user, function (err) {
          if (err) {
            req.flash('error', err.message);
            console.log('user',user)
            return res.redirect('back');
          }
          console.log('Logged user in using Passport req.login()');
          console.log('username',req.user.username);
          req.flash('info', '<div class="alert alert-success"><div class="text-center">Congratulations,'+req.user.username+' you successfully registered</div></div>')
          res.redirect('/business-owner/dashboard')
          // res.render('home',{'info' :req.flash('info'), username: req.user.username});
        })
      ).catch(err => {
        console.log(err)
      })
    ).catch(err => {
      console.log(err)
    })
  })
})

router.get('/forgot', function(req, res){
  if (req.isAuthenticated()) {
    res.redirect('back');
  } else {
    res.render('guest/forgot',{'error' :req.flash('error'), 'info' :req.flash('info')});
  };
});

router.post('/forgot', function(req, res, next) {
  var email = req.body.email;
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function(token, done) {
      console.log(email);
      users.findAll({
        where: {
          email: [email],
          [op.and]: {status: 1}
        }
      }).then(function(rows, err) {
        if (rows.length <= 0) {
          req.flash('error', '<div class="alert alert-danger"><div class="text-center">No account with that email address exists.</div></div>');
          return res.redirect('/forgot');
        }
        var spw_token = token;      
        var spw_exp = moment().toDate();
        var reset = {password_token: spw_token, password_date: spw_exp}
        users.update(
          reset,
          { where: {email: [email]}}
        ).then(function(rows, err) {
          done(err, token, rows)
          // console.log(token)
        })
      })
    },
    
    function(token, rows, done) {
      console.log('token',token)
      var msge = {
        to: email,
        from: 'azz@example.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ig-nore this email and your password will remain unchanged.\n',
      };
      sgMail.send(msge, function(err) {
        req.flash('info','<div class="alert alert-success"><div class="text-center">'+ 'An e-mail has been sent to ' + email + ' with further instructions.'+'</div></div>');
        done(err, 'done');
      });
    }
  ], 
  function(err) {
    if (err) return next(err);
    // res.redirect('/forgot')
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  users.findAll({
    where: {
      password_token: [req.params.token]
    }
  }).then(function(rows) {
    if (rows.length <= 0) {
      req.flash('error', '<div class="alert alert-danger"><div class="text-center">'+'Password reset token is invalid'+'.</div></div>');
      return res.redirect('/forgot');
    }
    console.log(rows[0].password_date);
    var min = moment().diff(rows[0].password_date, 'minute')
    console.log(min);

    if (min >=160) {
      users.update(
        {password_token: null, password_date: null},
        { where: {password_token: [req.params.token]}}
      ).then().catch(function(err) {
        console.log(err)
      })
      req.flash('error', '<div class="alert alert-danger"><div class="text-center">'+'Password reset token is invalid or has expired.'+'.</div></div>');
      return res.redirect('/forgot');
    }
    var username = rows[0].username
    res.render('guest/reset', {
      susername: username
    })
  }).catch(function(er) {
    if(err) throw err
  })
});

router.post('/reset/:token', function(req, res, next) {
  var username = req.body.username;
  console.log(username)
  async.waterfall([
    function(done) {
      users.findAll({
        where: {
          password_token: [req.params.token]
        }
      }).then(function(rows, err) {
        if (rows.length <= 0) {
          req.flash('error', '<div class="alert alert-danger"><div class="text-center">'+'No account with that email address exists.'+'.</div></div>');
          return res.redirect('/forgot');
        }
        var spw_token = undefined;      
        var spw_exp = undefined;  
        var spassword = req.body.password;  
        var sspassword = bcrypt.hashSync(spassword);
        
        var reset = {password_token: spw_token, password_date: spw_exp, password: sspassword}
        users.update(
          reset,
          { where: {username: [username]}}
        ).then().catch(function(err) {
          console.log(err)
        })
        var email = rows[0].email;
        console.log(email)
        done(err, rows);
      }).catch(function(err) {
        console.log(error)
      })
    },
    
    function(rows, done) {
      var msge = {
        to: rows[0].email,
        from: 'vy.phera@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + rows[0].email + ' has just been changed.\n'
      };
      sgMail.send(msge, function(err) {
        req.flash('success','<div class="alert alert-success"><div class="text-center">'+'Success! Your password has been changed.'+'.</div></div>');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

router.get('/browse', function(req, res, next) {
  res.render('guest/browse', { title: 'Express' });
});

router.post('/report', function(req, res, next) {
  validateEditEmail.validate({
    email: req.body.email
  }, function(errors, value) {
    if(errors) {
      return res.send('1')
    }

    if(req.body.reasonReport === undefined) {
      return res.send('2')
    }

    review_reports.findAll({
      where: {
        review_id: req.body.idreview,
        [op.and]: {email: req.body.email}
      }
    })
    .then(rows => {
      console.log(rows.length)
      if(rows.length>=1) {
        console.log('Email Exist')
        return res.send('3')
      } else {
        review_reports.create(
          {
            review_id: req.body.idreview,
            email: req.body.email,
            report_type: req.body.reasonReport
          }
        ).then(() => {
          console.log('Succcess')
          return res.send('4')
        }).catch(err => {
          console.error(err)
        })
      }
    }).catch(err => {
      console.error(err)
    })
  })
});

function writeday(h, a, b) {
  var c = {}
  if(a === null & b === null) {
    c.day = h;
    c.op = 'close'
  } else {
    c.day = h;
    c.op = a+' - '+b
  }
  return c
}

router.get('/outletinfo=:id', function(req, res, next) {
  outlets.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
      model: business,
      attributes: [
        'id',
        'name',
        'image'
      ],
      },
      {
        model: address,
        attributes: [
          [Sequelize.fn('X', Sequelize.col('point')), 'lat'], [Sequelize.fn('Y', Sequelize.col('point')), 'long'], 'line1', 'line2', 'administrative_area_1', 'postalcode'
        ]
      },
      {
        model: days
      }
    ]
    }).then(rows => {
      var location = []
      var dy =[
        writeday('Monday', rows.day.d1_open, rows.day.d1_close),
        writeday('Tuesday', rows.day.d2_open, rows.day.d2_close),
        writeday('Wednesday', rows.day.d3_open, rows.day.d3_close),
        writeday('Thrusday', rows.day.d4_open, rows.day.d4_close),
        writeday('Friday', rows.day.d5_open, rows.day.d5_close),
        writeday('Saturday', rows.day.d6_open, rows.day.d6_close),
        writeday('Sunday', rows.day.d7_open, rows.day.d7_close)
      ]
      var tdy = moment().isoWeekday()
      console.log(moment().format('YYYY-MM-DD'))
      var timenow = moment().format('HH:mm')
      dy[tdy-1].clss = 'font-weight-bold' 
      if(dy[tdy-1].op !== 'close') {
        const libur2018 = libur.getDataByYear(2018)[0].data
        for(var i = 0; i < libur2018.length; i++) {
          var dateHash = {
            Januari : '01',
            Februari: '02',
            Maret: '03',
            April: '04',
            Mei: '05',
            Juni: '06',
            Juli: '07',
            Agustus: '08',
            September: '09',
            Oktober: '10',
            November: '11',
            Desember: '12'
          };
          var a = libur2018[i].date;
          var b = a.split(' ')
          var c = b[2]+'-'+dateHash[b[1]]+'-'+b[0]
          libur2018[i].datee = c
          console.log(c)
          if(moment().format('YYYY-MM-DD') === c && rows.role_public_holiday === 1) {
            dy[tdy-1].op = 'Close'
            break;
          } 
        }
        var tt = dy[tdy-1].op
        var ttt = tt.split(' - ')
        if (moment().isBetween(moment(ttt[0],'HH:mm:ss'), moment(ttt[1],'HH:mm:ss'))) {
          dy[tdy-1].crnt = 'Open'
        } else {
          dy[tdy-1].crnt = 'Close'
        }
        console.log(ttt)
      }
      console.log(dy)
      location.push(rows.name, rows.address.dataValues.lat, rows.address.dataValues.long, 0, 'http://localhost:3000/outletinfo='+rows.id, rows.image)
      console.log(location)
      reviews.findAll({
        where: {
          outlet_id: req.params.id,
          [op.and]: {status: 1}
        },
        limit: 2,
        order: [
          ['id','DESC']
        ],
        include: {
          model: outlets,
          attributs : [
            'name', 'id'
          ]
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
        outlets.findAll({
          where: {
            id_bussines: rows.business.id
          },
          limit: 3,
          include: [
            {
              model: address,
              attributes: [
                'administrative_area_3'
              ]
            }
          ]
        
        }).then(rows3 => {
          outlets.findAll({
            where: {
              id_bussines: '1'
            },
            include: [
              {
                model: business,
                include: [
                  {
                    model: business_categories
                  }
                ]
              }
            ],
            group: ['business->business_category.category_id']
          }).then(rows4 => {
              outlets.findAll({
              where: {
                id_bussines: [rows4[0].business.business_category.category_id, rows4[1].business.business_category.category_id, rows4[2].business.business_category.category_id]
              },
              include: [
                {
                  model: business,
                  include: [
                    {
                      model: business_categories
                    }
                  ]
                },
                {
                  model: address,
                  attributes: [
                    [Sequelize.fn('X', Sequelize.col('point')), 'lat'], [Sequelize.fn('Y', Sequelize.col('point')), 'long']
                  ]
                }
              ],
              group: ['outlets.id']
            })
            .then(rows2=>{
              var locationz = [];
              for(var i = 0 ; i < rows2.length; i++) {
                var as = []
                as.push(rows2[i].name, rows2[i].address.dataValues.lat, rows2[i].address.dataValues.long, i, 'http://localhost:3000/outletinfo='+rows2[i].id)
                locationz.push(as)
              }
              console.log(locationz)
              console.log(rows3)
              console.log(location)
              res.render('guest/outletinfo', { data: rows, review: tim2, data2: JSON.stringify(location), day: dy, today: dy[tdy-1], other: rows3, data3: JSON.stringify(locationz)});
            })
          })          
        })
      })
  })
});

router.post('/addreview=:id', function(req, res, next) {
  validateEditEmail.validate({
    email:req.body.email
  }, function(errors, value) {
    if(errors) {
      return res.send('1')
    }

    reviews.findAll({
      where: {
        email: req.body.email
      }
    }).then(rows => {
      if(rows.length > 0) {
        return res.send('3')
      } else {
        if(req.body.rating === undefined) {
          var ratings = 0
        } else {
          var ratings = req.body.rating*(100/5)
        }
      
        if(req.body.name === '') {
          var revname = 'Anonim'
        } else {
          var revname = req.body.name
        }
        async.waterfall([
          function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
          },
    
          function(token, done) {
            reviews.create(
              {
                outlet_id: req.params.id,
                name: revname,
                email: req.body.email,
                content: req.body.content,
                rating: ratings,
                ver_token: token
              }
            ).then(function(rows, err) {
              reviews.findAll({
                where: {
                  ver_token: token
                },
                include: {
                  model: outlets,
                  attributs : [
                    'name', 'id'
                  ]
                }
              }).then(function(rows, err) {
                done(err, token, rows)
              })
            })
          },
          
          function(token, rows, done) {
            console.log('email',rows[0].outlet.name)
            var msge = {
              to: rows[0].email,
              from: 'outlet_finder@example.com',
              subject: 'Confirm your email',
              text: 'Hello.\n\n' + rows[0].name + ' !' +
              'You have given a review on the outlet: ' + rows[0].outlet.name + '\n\n' +
              'confirm your email so your review can be displayed' + '\n\n' +
              ' http://' + req.headers.host + '/confirm_rev/' + token + '\n\n' +
              'If you did not request this, please ig-nore this email.\n',
            };
            sgMail.send(msge, function(err) {
              console.log('success')
              done(err, 'done');
            });
          }
        ], 
        function(err) {
          if (err) return next(err);
          return res.send('2')
        });
      }

    })
  })
});

router.get('/confirm_rev/:token', function(req, res) {
  reviews.findAll({
    where: {
      ver_token: [req.params.token]
    }
  }).then(function(rows, err) {
    if (rows.length<=0) {
      req.flash('message','<div class="alert alert-danger"><div class="text-center">invalid token or link is broken</div></div>')
      res.redirect('/reviews')
    } else {
      reviews.update(
        {
          status: 1,
          ver_token: ''
        },
        {
          where: {
            ver_token: [req.params.token]
          }
        }
      ).then(rows2 => {
        req.flash('info','<div class="alert alert-success"><div class="text-center">Your review has been successfully confirmed</div></div>')
        res.redirect('/reviews='+rows[0].outlet_id)
      }).catch(function(err) {
        console.log(err)
      })
    }
  }).catch(function(err) {
    console.log(err)
  })
})

router.get('/outletinfo2', function(req, res, next) {
  res.render('guest/outlet-info', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  var location = [];
  outlets.findAll({
    attributes: [
      'id',
      'name'
    ],
    include: {
      model: address,
      attributes: [
        [Sequelize.fn('X', Sequelize.col('point')), 'lat'], [Sequelize.fn('Y', Sequelize.col('point')), 'long']
      ]
    }
  })
  .then(rows => {
    for(var i = 0 ; i < rows.length; i++) {
      var as = []
      as.push(rows[i].name, rows[i].address.dataValues.lat, rows[i].address.dataValues.long, i, 'http://localhost:3000/outletinfo='+rows[i].id)
      location.push(as)
    }
    console.log(location)
    res.render('guest/search', { title: 'Search', data: JSON.stringify(location)});
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

router.get('/reviews', function(req, res, next) {
  reviews.findAll(
    {
      where: {
        status: 1
      },
      order: [
        ['id','DESC']
      ],
      include: {
        model: outlets,
        attributs : [
          'name', 'id'
        ]
      }
    }
  )
  .then(rev => {
    var tim2 =[]
    for(var i = 0 ; i <rev.length; i++) {
      var m = time(rev[i].created_at)
      var tim = {}
      tim.rev = rev[i];
      tim.date = m;
      tim2.push(tim)
    }
    res.render('guest/review', { review: tim2, time_info: tim, 'info': req.flash('info'), 'message' : req.flash('message')});
  })
});

router.get('/reviews=:id', function(req, res, next) {
  reviews.findAll({
    where: {
      outlet_id: req.params.id,
      [op.and]: {status: 1}
    },
    order: [
      ['id','DESC']
    ],
    include: {
      model: outlets,
      attributs : [
        'name', 'id'
      ]
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
    res.render('guest/review', { review: tim2, time_info: tim, 'info': req.flash('info'), 'message' : req.flash('message')});
  })
});
module.exports = router;
