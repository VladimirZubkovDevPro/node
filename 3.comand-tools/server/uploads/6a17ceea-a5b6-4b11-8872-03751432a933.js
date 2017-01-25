#! /usr/bin/env node

const inquirer = require('inquirer');
const argv = require( 'argv' );
const file = require('./file.service');
const config = require('./config');

const args = argv.option({
  name: 'path',
  short: 'p',
  type: 'string'
}).run();

const questions = [{
  type: 'input',
  name: 'username',
  message: 'Name',
  default: () => config.user.name
},{
  type: 'input',
  name: 'path',
  message: 'Path to file',
  default: () => args.options.path,
  validate(value) { file.check(value || args.options.path, this.async()) }
},{
  type: 'password',
  name: 'password',
  message: 'Password',
  default: () => config.user.password,
  validate: (value) => (value == config.user.password ? true : 'Wrong password')
}];

inquirer.prompt(questions).then((answers) => file.send(answers));


