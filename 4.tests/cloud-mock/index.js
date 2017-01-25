var express = require('express');
var app = express();
var port = 3000;
var helper = require('./helper');

app.all('/upload/*', function(req, res) {
  helper.createResponse(req.url, req.method).then(data => res.send(data));
});

app.listen(port, function () {
  console.log('Server listening on port ' + port);
});