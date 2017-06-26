const express = require ('express');
const router = express.Router();

// bring in article models
let Article = require('../models/article')

// add route
router.get('/add' ,function(req, res) {
  res.render('add_article', {
    title:'Add Article'
  })
});

// add submit POST route  (same URL allowed as long as different request type)
router.post('/add', function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added')
        res.redirect('/')
      }
    })
  }
});

// update submit article
router.post('/edit/:id', function(req, res) {
  let article = {}
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){  // useing Article Model
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated')
      res.redirect('/')
    }
  });
});

// get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
      article: article
    });
  });
});

// get Edit form
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title:'Edit Article',
      article: article
    });
  });
});

// delete article
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err)
    }
    req.flash('danger', 'Article Deleted')
    res.send('Success');
  });
});

module.exports = router;
