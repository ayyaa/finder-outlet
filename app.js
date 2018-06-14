const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const passport = require('passport');
const multer = require('multer')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');

const sess = require('express-session');
const Store = require('express-session').Store;
const BetterMemoryStore = require('session-memory-store')(sess);
const flash = require('express-flash');

const admin = require('./routes/admin');
const business = require('./routes/business-owner');
const guest = require('./routes/guest');
// const config = require('./src/config/config')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('./src/models');
const keywords = models.keywords;
const user = models.users;
const store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
const ConnectRoles = require('connect-roles')
const app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store:  store,
  resave: true,
  saveUninitialized: true 
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done, err){
      if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
      user.findOne({
        attributes: ['id', 'username','password', 'role', 'email'],
        where: {
          [Op.or]: [{username: [username]}, {email: [username]}],
          [Op.and]: {status:1}
        }
      }).then(function(rows, err) {
        if(!rows){ console.log('gagal'); return done(null, false, req.flash('message','Invalid username or email.')); }
        var dbPassword  = rows.password;
        // console.log('dbpw = ', dbPassword)
        // console.log('pass = ', password)
        // console.log('role = ', rows.role)
        bcrypt.compare(password, dbPassword, function(err, res) {
          if(res) {
            console.log('sukses')
            return done(null, rows);
           } else {
             console.log('error')
            return done(null, false, req.flash('message','Invalid password.'));
           } 
        });          
      }).catch(function(err) {
        console.log(err)
      })
    }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  user.findAll({
    where: {
      id: [id]
    }
  }).then(function(rows, err) {   
    done(err, rows);
  })
});

var role = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

app.use(role.middleware())

role.use(function (req, action) {
  if (!req.isAuthenticated()) return action === 'access home page';
})

role.use('access BO page', function (req) {
  if (req.user[0].role === 'BUSINESS OWNER') {
    return true;
  }
})

role.use('access admin page', function (req) {
  if (req.user[0].role === 'ADMIN') {
    return true;
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}


app.use('/admin', role.can('access admin page'), admin);
app.use('/business-owner', role.can('access BO page'),business);
app.use('/', guest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('BAD REQUEST');
  err.status = 404;
  next(err);
});

app.use(function(req, res, next) {
  var err = new Error('BAD REQUEST');
  err.status = 500;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
