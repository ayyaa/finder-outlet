var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const models = require('../src/models');
const categories = models.categories;
const business = models.business;
const business_category = models.business_category;
const users = models.users;
const validateJoi = require('../src/validation/joi-create-category');
const flash = require('connect-flash');
business.belongsToMany(categories, {through: 'business_category', foreignKey: 'business_id', otherKey: 'category_id'})
categories.belongsToMany(business, {through: 'business_category', foreignKey: 'category_id', otherKey: 'business_id'})

router.get('/dashboard', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Express' , active1: 'active','message': req.flash('message'),'info': req.flash('info')});
});

router.get('/list-categories', function(req, res, next) {
  categories.findAll()
  .then(rows => {
    console.log(rows);
    // res.render('admin_list', {title: 'User List', data: rows, nameTag: req.user.user});
    res.render('admin/list-categories', { active2: 'active', data: rows});
  })
  .catch(() => {
    res.status(500).json({"status_code": 500,"status_message": "internal server error"});
  })
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

router.get('/edit-category/:id', function(req, res, next) {
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
        description: rows[0].description,
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
        description: req.body.description,
      });
    } 
  })
});

router.post('/delete-category/:id', function(req, res, next) {
  categories.destroy({ 
    where: {
      id: req.params.id
    },
    force: true })
  .then(() => {
    req.flash('success', 'Selected categories has been removed.')
    res.redirect('/admin/list-categories');
  })
});

router.get('/account', function(req, res, next) {
  res.render('admin/account');
});

router.get('/list-business', function(req, res, next) {
  business.findAll({
  attributes: [
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
    console.log(rows)
    res.render('admin/list-business', {  active3: 'active', data: rows});
  }).catch(err => {
    console.error(err)
  })
});

router.get('/list-outlets', function(req, res, next) {
  res.render('admin/list-outlets', {  active5: 'active'});
});



router.get('/list-reviews', function(req, res, next) {
  res.render('admin/list-reviews', {  active6: 'active'});
});

router.get('/list-report-reviews', function(req, res, next) {
  res.render('admin/list-report-reviews', {  active7: 'active'});
});

router.get('/list-business-owner', function(req, res, next) {
  users.findAll({ 
    where: {
      rule: 'BO'
    }
  })
  .then(rows => {
    console.log(rows[0]);
    // res.render('admin_list', {title: 'User List', data: rows, nameTag: req.user.user});
    res.render('admin/list-bo', {  active4: 'active', data: rows});
    // res.render('admin/list-categories', { active2: 'active', data: rows});
  })
 
});

<<<<<<< HEAD
router.post('/logout', function (req, res) {
  if(!req.isAuthenticated()) {
     notFound404(req, res, next);
  } else {
     req.logout();
     res.redirect('/login');
  }
})

// router.get('/create-category', function(req, res, next) {
//   res.render('admin/layout-admin');
// });

module.exports = router;
=======
module.exports = router;
>>>>>>> 980fc40ee240c83328625e641b6aae493ce88f62
