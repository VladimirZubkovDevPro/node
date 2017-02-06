var nodeMailer = require('nodemailer');
var hbs = require('express-handlebars').create();
var fs  = require('fs');
var uuid = require('node-uuid');
var config = {
  email: '***'
};

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: '***',
    pass: '***'
  }
});

var products = {
  1: {
    name: 'meet',
    subject: 'You already buy Meet',
    clientMail: './views/mail/letter.handlebars'
  },
  2: {
    name: 'cucumber',
    subject: 'You already buy Cucumber',
    clientMail: './views/mail/letter.handlebars'
  },
  3: {
    name: 'tomato',
    subject: 'You already buy Tomato',
    clientMail: './views/mail/letter.handlebars'
  }
};

module.exports = {
  send(data, cb) {
    data.id = uuid.v1({});

    var clientMailOptions = {
      from: 'Product-shop <info@mailer.com>', // sender address
      to: data.user_email, // receiver
      subject: products[data.product].subject, // Subject line
      html: hbs.render(fs.readFileSync(products[data.product].clientMail).toString(), data)
    };

    var infoMailOptions = {
      from: 'Product-shop <info@mailer.com>', // sender address
      to: config.email,
      subject: 'Заявка ' + products[data.product].name + ': ' + data.user_name,
      html: hbs.render(fs.readFileSync('./views/mail/order.handlebars').toString(), data)
    };

    transporter.sendMail(clientMailOptions, function(error) {
      if (error) {
        console.log(error.message);
      }
    });

    transporter.sendMail(infoMailOptions, function(error) {
      if (error) {
        cb({ status: 'error' });
        return;
      }

      cb(null, { status: 'ok', id: data.id });

      transporter.close(); // close the connection pool
    });
  }
};