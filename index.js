const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts =  require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const flash = require('connect-flash');

const MongoStore = require('connect-mongo')(session);

const scssMiddleware = require('sass-middleware');
const customMware = require('./config/middleware');


app.use(scssMiddleware({
   src: './assets/scss',
   dest: './assets/css',
   debug: true,
   outputStyle: 'extended',
   prefix:'/css'
}))

// create an instance of MongoStore and pass in the mongoose connection object
const sessionStore = new MongoStore({
  mongooseConnection: db,
  autoRemove: 'disabled'
}, function(err) {
  console.log(err || 'connect-mongo setUp ok')
});

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts)

// extraact styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));
// make the uploads path avaible to browser
app.use('/uploads', express.static(__dirname + '/uploads'));




//setup the view engine
app.set('view engine', 'ejs')
app.set('views', './views');


// const sessionStore = new MongoStore({
//    mongooseConnection: db,
//    autoRemove: 'disabled'
//  },
//  function(err){
//     console.log(err || 'connect-mongo setUp ok')
//  });

// mongo store is used to store the session cookie in the DB
app.use(session({
   name:'codial',
   // TODO :change the secret before deployement in produxtion mode
   secret:'blahsomething',
   saveUninitialized: false,
   resave: false,
   cookie: {
      maxAge: (1000 * 60 * 100)
   },
   store: sessionStore
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(customMware.setFlash);

app.use('/', passport.setAuthenticatedUser);


// use express router
app.use('/', require('./routes/index'));

app.listen(port,function(err){
   if(err){
      console.log(`Error from index.js: ${err}`);
   }
   console.log(`Server is up and running on port ${port}`)
})