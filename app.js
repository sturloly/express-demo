const express = require('express');
const path = require('path');  // core module inclued by default
const mongoose = require('mongoose'); // structure data on a application level
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')

mongoose.connect(config.database);
const db = mongoose.connection;

// check connection
db.once('open',function(){
  console.log('Connected to MongoDB');
});

// check for DB errots
db.on('error', function(err){
  console.log(err);
});

// init app
const app = express();

// breing in models
let Article = require('./models/article')

// load view engine
app.set('views', path.join(__dirname, 'views'));  // dirname meaning the current direc, view -- views folder
app.set('view engine', 'pug'); // chose the pug view engine

// body parser middleware
// parse application/x-www.form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}));
// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport)

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// have to be here before home route
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles)
app.use('/users', users)


//start server
app.listen(80,function(){
  console.log("Server Started On Port 80...")
});
