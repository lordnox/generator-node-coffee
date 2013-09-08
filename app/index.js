'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var NodeCoffeeGenerator = module.exports = function NodeCoffeeGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      bower: false,
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};
util.inherits(NodeCoffeeGenerator, yeoman.generators.NamedBase);

NodeCoffeeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(
    this.yeoman +
    '\nThe name of your project shouldn\'t contain "node" or "js" and' +
    '\nshould be a unique ID not already in use at search.npmjs.org.');

  var prompts = [{
    name: 'name',
    message: 'Module Name',
    default: path.basename(process.cwd())
  }, {
    name: 'description',
    message: 'Description',
    default: 'The best module ever.'
  }, {
    name: 'homepage',
    message: 'Homepage'
  }, {
    name: 'license',
    message: 'License',
    default: 'MIT'
  }, {
    name: 'githubUsername',
    message: 'GitHub username'
  }, {
    name: 'authorName',
    message: 'Author\'s Name'
  }, {
    name: 'authorEmail',
    message: 'Author\'s Email'
  }, {
    name: 'authorUrl',
    message: 'Author\'s Homepage'
  }];

  this.currentYear = (new Date()).getFullYear();

  this.prompt(prompts, function (props) {
    this.slugname = this._.slugify(props.name);
    this.camelname = this._.camelize(this.slugname);

    this.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this.slugname;

    if (!props.homepage) {
      props.homepage = this.repoUrl;
    }

    this.props = props;

    cb();
  }.bind(this));
};

NodeCoffeeGenerator.prototype.lib = function lib() {
  this.mkdir('src');
  this.template('src/name.coffee', 'src/' + this.slugname + '.coffee');
};

NodeCoffeeGenerator.prototype.test = function test() {
  this.mkdir('test');
  this.mkdir('test/src');
  this.mkdir('test/support');

  this.copy('test/support/globals.js', 'test/support/globals.js');
  this.copy('test/support/runner.js', 'test/support/runner.js');

  this.template('test/src/specs/name.spec.coffee', 'test/src/specs/' + this.slugname + '.spec.coffee');
};

NodeCoffeeGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('travis.yml', '.travis.yml');

  this.template('README.md');
  this.template('Gruntfile.js');
  this.template('_package.json', 'package.json');
};
