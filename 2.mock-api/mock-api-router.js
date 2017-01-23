var path = require('path');
var fs = require('promised-io/fs');
var Q = require("promised-io/promise");
var _ = require('underscore');

module.exports = function(req, res) {
  var filePath = path.join(__dirname, req.url, req.method + '.json');

  fs.readFile(filePath, 'utf8').then(function(data){
    var fileData = JSON.parse(data);

    if(_.isArray(fileData)) {
      var results = [];

      _.each(fileData, function (dir) {
        var filePath = path.join(__dirname, req.url, dir, req.method + '.json');
        results.push(fs.readFile(filePath, 'utf8').then(function(data) {
          return JSON.parse(data); }));
      });

      Q.all(results).then(function() {
        res.send(arguments[0]);
      });
    } else {
      res.send(fileData)
    }
  }, function(err) {
    res.send(err)
  });
};