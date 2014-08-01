'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var gruntMagentoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          callback: function() {
            console.log(chalk.bold.cyan('Don\'t forget to exclude /node_modules and /bower_components directories from version control! Please see .gitignore.example file.'));
          }
        });
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('Yeoman generator to boost Magento front-end development'));

    var prompts = [{
      name: 'themeName',
      message: 'What is your theme\'s name?',
      default: 'new-project'
    }, {
      name: 'localHost',
      message: 'What is your localhost\'s URL?',
      default: 'new-project.dev'
    }, {
      name: 'create',
      message: 'Would you like to create theme structure now? (type "N" if your theme already exists!)',
      type: 'confirm'
    }];

    this.prompt(prompts, function (props) {
      this.localHost = props.localHost;
      this.create = props.create;
      this.themeName = props.themeName;

      done();
    }.bind(this));
  },

  app: function () {
    if (this.create) {
      this.mkdir('app');
      this.mkdir('app/design');
      this.mkdir('app/design/frontend');
      this.mkdir('app/design/frontend/default');
      this.mkdir('app/design/frontend/default/' + this.themeName);
      this.mkdir('app/design/frontend/default/' + this.themeName + '/layout');

      this.mkdir('skin');
      this.mkdir('skin/frontend');
      this.mkdir('skin/frontend/default');
      this.mkdir('skin/frontend/default/' + this.themeName);
      this.mkdir('skin/frontend/default/' + this.themeName + '/css');
      this.mkdir('skin/frontend/default/' + this.themeName + '/scss');
      this.mkdir('skin/frontend/default/' + this.themeName + '/img');
      this.mkdir('skin/frontend/default/' + this.themeName + '/js');
    }

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_gruntfile.js', 'Gruntfile.js');
    this.copy('_gitignore.example', '.gitignore.example');

    if (this.create) {
      this.copy('_local.xml', 'app/design/frontend/default/' + this.themeName + '/layout/local.xml');
      this.copy('_script.js', 'skin/frontend/default/' + this.themeName + '/js/script.js');
      this.copy('_styles.scss', 'skin/frontend/default/' + this.themeName + '/scss/styles.scss');
      this.copy('_1column.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/1column.phtml');
      this.copy('_2columns-left.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/2columns-left.phtml');
      this.copy('_2columns-right.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/2columns-right.phtml');
      this.copy('_3columns.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/3columns.phtml');
      this.copy('_empty.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/empty.phtml');
      this.copy('_popup.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/popup.phtml');
      this.copy('_print.phtml', 'app/design/frontend/default/' + this.themeName + '/template/page/print.phtml');
    }
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = gruntMagentoGenerator;