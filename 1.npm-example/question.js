var Hero = require('./hero');

function Question(text) {
  this.hero = new Hero();
  this.text = text || 'What hero name?';
  this.compare = function(name) {
    if(this.hero.compare(name)) {
      console.log('Yup', this.hero.name);
    } else {
      console.log('No!', this.hero.name);
    }
  };

  this.ask = function() {
    console.log(this.text);
  };
}

module.exports = Question;