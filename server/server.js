/* eslint-disable no-param-reassign */
const path = require('path');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');
const verifyToken = require('./utils/verifyToken');
const userController = require('./controllers/user');

const authRouter = require('./routes/api/auth');
const usersRouter = require('./routes/api/users');
// MongoDB Models Schema
const User = require('./models/userModel');

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/api/callback',
  },
  ((accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    //
    // console.log('auth0', profile);
    /*
     User.remove({ githubId: profile.id }, function (err, user) {
       console.log('try to remove',err,user);
     });
     */
    User.findOrCreate({ user_id: profile.id }, (err, user) => {
      if (err) console.error('mangoose error', err);

      user.login = profile.displayName;
      user.url = profile.url;
      user.username = profile.displayName;
      user.save();
      return done(err, user);
    });
  }),
);

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();
const PORT = process.env.PORT || 5000;

// ------
// Routes
// ------

app.use(express.json({ extended: false }));
app.use(cookieParser());

// config express-session
const sess = {
  secret: 'VAULTEDTECH SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

if (app.get('env') === 'production') {
  // If you are using a hosting provider which uses a proxy (eg. Heroku),
  // comment in the following app.set configuration command
  //
  // Trust first proxy, to prevent "Unable to verify authorization request state."
  // errors with passport-auth0.
  // Ref: https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614
  // Ref: https://www.npmjs.com/package/express-session#cookiesecure
  // app.set('trust proxy', 1);

  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.use(flash());

// Handle auth failure error messages
app.use((req, res, next) => {
  if (req && req.query && req.query.error) {
    req.flash('error', req.query.error);
  }
  if (req && req.query && req.query.error_description) {
    req.flash('error_description', req.query.error_description);
  }
  next();
});

app.use('/api', authRouter);
app.use('/api/', usersRouter);

app.post('/api/register', userController.registerUser);
app.post('/api/login', userController.loginUser);
// Used to check if the users token is valid
// Allows us to protect routes on the client side
app.get('/api/checkToken', [verifyToken], (req, res) => {
  res.sendStatus(200);
});
// Clear session connect.sid on logout

/**
 * Log a user out and clear connect.sid
 */
app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Collection routes
app.use('/api/collections', require('./routes/api/collections'));

// Let React handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

// -------------
// Connect to DB
// Then start server
// -----------------

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});
