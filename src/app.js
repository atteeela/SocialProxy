/*!
 * socialproxy
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 *
 * Author:
 *     André König <andre.koenig@konexmedia.com>
 *
 * MIT Licensed
 * GIT TEST
 */
var async            = require('async'),
    express          = require('express'),
	expressNamespace = require('express-namespace'),
	passport         = require('passport'),
	pkginfo          = require('pkginfo')(module, 'name', 'version', 'author')
    Solar            = require('solar'),
	Settings         = require('settings');

var meta = module.exports,
	app = module.exports = express.createServer();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'ejs');
    app.set( "jsonp callback", true );
	app.use(express.cookieParser()); 
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Load the application settings
var config = {
	environment: new Settings(__dirname + '/config/environment.js').getEnvironment().environment,
    meta: meta,
	services: new Settings(__dirname + '/config/services.js').getEnvironment().services
};

// Init the customer database.
var databases = {};

async.waterfall([
    function (callback) {
    	databases.users = new Solar('db/users.db');
        databases.users.on('loaded', callback);
    },
    function (callback) {
        databases.customers = new Solar('db/customers.db');
        databases.customers.on('loaded', callback);
    }
], function (err, results) {

    // Init the app.
	require('./app/')(app, config, databases);

	// Start the listening process.
	app.listen(process.env.PORT || config.environment.port || 3000);

	console.log("%s (v%s) listening on port %d in %s mode", meta.name, meta.version, app.address().port, app.settings.env);
});