var superheroes = require('superheroes');
var encrypts = require('./encrypt');

function Hero() {
  this.name = superheroes.random();
  this.encriptedName = encrypts.getReverse(this.name);
  this.compare = function(name) {
    return name == this.name;
  };
}

module.exports = Hero;