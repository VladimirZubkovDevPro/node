const express = require('express');
const path = require('path');
const fileman = require('fi-fileman');
const passport = require('passport');
const http = require('http');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const router = require('./router');
const app = express();
const logger = new require('simple-node-logger').createSimpleLogger();

fileman.configure({ stordir: path.join(__dirname, config.dir) });
passport.serializeUser((user, cb) => cb(null, user.username));

passport.use(new LocalStrategy((username, password, done) => {
  if (username != config.user.name || password != config.user.password) {
    return done(null, false);
  }

  return done(null, { username, password });
}));

app.use(fileman.multiparser());
app.use(passport.initialize());
app.use('/', router);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

http.createServer(app).listen(config.port);

logger.info(`Server start on port ${config.port}`);