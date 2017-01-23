const request = require('request');
const fs = require('fs');
const config = require('./config');
const path = require('path');

module.exports = {
  send(data) {
    request.post({
      url: `${config.url}/upload`,
      formData: {
        username: data.username,
        password: data.password,
        syncFile: fs.createReadStream(data.path)
      }}, (error, response, body) => {
      console.log(JSON.parse(body).message);
    });
  },

  check(path, cb) {
    fs.stat(path, (err) => {
      if (err) { return cb(null, false); }

      return cb(null, true);
    });
  }
};