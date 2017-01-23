const express = require('express');
const router = express.Router();
const passport = require('passport');
const file = require('./file.service');

router.post('/upload',  passport.authenticate('local'), function(req, res, next) {
  file.save(req.files[0], (fileinfo) => {
    res.status(200);
    res.json(fileinfo);
  });
});

module.exports = router;
