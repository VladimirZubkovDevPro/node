var path = require('path');
var _ = require('underscore');
var files = require('./file.service');

module.exports = {
  createResponse(url, method) {
    return files.getOne(path.join(__dirname, url, method + '.json')).then((data) => {
      if(!_.isArray(data)) {
        return data;
      }

      return files.getAll(url, method)
    });
  }
};

