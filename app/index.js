'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var cgUtils = require('../utils.js');

var CgangularGenerator = module.exports = function CgangularGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.config.set('partialDirectory','src/partials/');
        this.config.set('directiveDirectory','src/directives/');
        this.config.set('filterDirectory','src/filters/');
        this.config.set('serviceDirectory','src/services/');
        var inject = {
            js: { 
                file: 'index.html', 
                marker: cgUtils.JS_MARKER,
                template: '<script src="<%= filename %>"></script>'
            },
            less: {
                file: 'app.less', 
                marker: cgUtils.LESS_MARKER,
                template: '@import "<%= filename %>";'
            }
        };
        this.config.set('inject',inject);
        this.config.save();
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CgangularGenerator, yeoman.generators.Base);

CgangularGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'appname',
        message: 'What would you like the angular app/module name to be?',
        default: path.basename(process.cwd())
    }];

    this.prompt(prompts, function (props) {
        this.appname = props.appname;
        cb();
    }.bind(this));
};

CgangularGenerator.prototype.askForUiRouter = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'router',
        type:'list',
        message: 'Which router would you like to use?',
        default: 0,
        choices: ['Standard Angular Router','Angular UI Router']
    }];

    this.prompt(prompts, function (props) {
        if (props.router === 'Angular UI Router') {
            this.uirouter = true;
            this.routerJs = 'bower_components/angular-ui-router/release/angular-ui-router.js';
            this.routerModuleName = 'ui.router';
            this.routerViewDirective = 'ui-view';
        } else {
            this.uirouter = false;
            this.routerJs = 'bower_components/angular-route/angular-route.js';
            this.routerModuleName = 'ngRoute';
            this.routerViewDirective = 'ng-view';
        }
        this.config.set('uirouter',this.uirouter);
        cb();
    }.bind(this));
};

CgangularGenerator.prototype.app = function app() {
    this.directory('skeleton/','./');
};
