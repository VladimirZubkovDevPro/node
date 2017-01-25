const path = require('path');
const fs = require('promised-io/fs');
const _ = require('underscore');
const Q = require("promised-io/promise");

module.exports = {
  getAll(url, method) {
    return fs.readdir('upload').then((files) => {
      const dirs =_.filter(files, file => file.indexOf('.') < 0);
      const results = [];
      _.each(dirs, dir => {
        const filePath = path.join(__dirname, url, dir, method + '.json');

        results.push(fs.readFile(filePath, 'utf8').then(data => JSON.parse(data), err => err));
      });

      return Q.all(results).then(info => info);
    }, err => err);
  },

  getOne(filePath) {
    return fs.readFile(filePath, 'utf8').then(data => JSON.parse(data), err => err);
  }
};