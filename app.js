require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const hbs = require('hbs')

/** Configurations */
require('./config/hbs.config');
require('./config/db.config');
require('./config/passport.config');
const session = require('./config/session.config');

const app = express();

/** View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, "/views/partials"));

/** Middlewares */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

/*app.use((req, res, next) => {
  // la variable path se podrá usar desde cualquier vista de hbs (/register, /posts)
  res.locals.path = req.path;
  res.locals.currentUser = req.user;

  // Damos paso al siguiente middleware
  next();
});*/

/** Configure routes */
const miscRouter = require('./routes/misc.routes');
app.use('/', miscRouter);
const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

/** Error Handling */
app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {},
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});
