const express = require ('express');
const router = express.Router();

// user models
let User = require('../models/user');

// register form
router.get('/register', function(req, res){
  res.render('register');
})

module.exports = router;
