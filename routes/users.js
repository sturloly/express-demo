const express = require ('express');
const router = express.Router();
const bcrypt = require ('bcryptjs');
<<<<<<< HEAD
const passport = require('passport');
=======
>>>>>>> ed7cf8a68e8223ac2bb4fde3d164e349c6ca0898

// user models
let User = require('../models/user');

// register form
router.get('/register', function(req, res){
  res.render('register');
})

// register process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords does not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return
          } else {
            req.flash('success', 'You are now register. congrats');
            res.redirect('/users/login');
          }
        })
      })
    });
  }
})

// Login Form
router.get('/login', function(req, res){
  res.render('login');
})

//Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req, res, next)
});

module.exports = router;