const _ = require('underscore');
const products = [{
  name: 'Meet',
  id: 1
},{
  name: 'Cucumber',
  id: 2
},{
  name: 'Tomato',
  id: 3
}];


module.exports = {
  getProducts: () => products,

  validateOrder(params) {
    return _.pick({
      user_name: this.validateName(params.user_name),
      user_email: this.validateEmail(params.user_email),
      product: this.validateProduct(params.product)
    }, _.identity);
  },

  validateName(name) {
    const errors = _.compact(_.map([{
      type: 'required',
      text: 'Name is required',
      validator: (name) => !name
    },{
      type: 'short',
      text: 'Min length 5 chars',
      validator: (name) => name.length < 5
    },{
      type: 'long',
      text: 'Max length 12 chars',
      validator: (name) => name.length >= 12
    }], (error) => {
      if (error.validator(name)) return error.text;
    }));

    if (errors.length) return errors;
  },

  validateEmail(email) {
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const errors = _.compact(_.map([{
      type: 'required',
      text: 'Email is required',
      validator: (email) => !email
    },{ type: 'email',
      text: 'Should be email',
      validator: (email) => !emailReg.test(email)
    }], (error) => {
      if (error.validator(email)) return error.text;
    }));

    if (errors.length) return errors;
  },

  validateProduct(product) {
    const errors = _.compact(_.map([{
      type: 'required',
      text: 'Product is required',
      validator: (product) => !product
    },{ type: 'product',
      text: 'Unknown product',
      validator: (product) => !_.findWhere(products, {id: +product})
    }], (error) => {
      if (error.validator(product)) return error.text;
    }));

    if (errors.length) return errors;
  }
};