var express = require('express');
var app = express();
var port = 3000;
var mockApiRouter = require('./mock-api-router');

app.all('/api/*', mockApiRouter);

app.listen(port, function () {
  console.log('Server listening on port ' + port);
});