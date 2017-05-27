const express          = require("express"),
      path             = require("path"),
      bodyParser       = require("body-parser"),
      cookieParser     = require("cookie-parser"),
      logger           = require("morgan"),
      hbs              = require("express-handlebars"),
      session          = require("client-sessions"),
      expressValidator = require("express-validator"),
      flash            = require('connect-flash'),
      csrf             = require('csurf'),
      mongoose         = require("mongoose"),
      compression      = require('compression'),
      favicon          = require('serve-favicon'),
      passport         = require("passport"),
      app              = express();

require("dotenv").config();
const url=process.env.MONGOLAB_URI;

/* connect to db */
mongoose.connect(url ||"mongodb://localhost:27017",(err)=>{
    if(err) console.log("not connect to db " +err);
    else console.log("connected to db");
});
      
require('./config/passport')(passport);

 /* view engine setup */
app.use(compression());
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, "images",'favicon.ico')));

/*  setup middlewares */
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    httpOnly:true,
    duration: 30 * 60 * 1000,
    activeDuration: 7 * 60 * 1000,
  }));
app.use(passport.initialize());
app.use(passport.session());  
  
/* config csurf */
app.use(csrf({cookie: true}));
app.use(function (req, res, next){
    res.locals._csrf = req.csrfToken();
    next();
}); 

/* config expressValidator */
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

/* connect flash  */
app.use(flash());

/*  create gloabals error variables */
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


/* caching disabled for every route */
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

/* routes */
app.use(require('./routes/index'));
app.use(require('./routes/images'));
app.use(require('./routes/notifications'));

/* catch 400 and handle error */
app.use((req,res,next)=>{
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

/* development error handler */
if(app.get("env") === "development"){
	app.use((err,req,res,next)=>{
res.status(err.status || 500);
res.render("error",{
	message: err.message,
	error: err
});
	});
}

/*  production error handler */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;