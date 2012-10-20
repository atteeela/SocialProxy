/*!
 * OpenProxy
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 *
 * Author:
 *     Robert Böing<robert.boeing@konexmedia.com>
 *
 * MIT Licensed
 *
 */

var async            = require('async'),
	express          = require('express'),
	expressNamespace = require('express-namespace'),
	passport         = require('passport'),
	Settings         = require('settings');


// Load the application settings

var config = {
	environment: new Settings(__dirname + '/config/environment.js').getEnvironment().environment,
	services: new Settings(__dirname + '/config/services.js').getEnvironment().services
};


var app = module.exports = express.createServer();


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



// Command - Line - Parameter

// node openproxy.js service id token secret(optional)

var auth = {
		service:process.argv[2],
		id:process.argv[3],
		token:process.argv[4],
		secret:(process.argv[2] == "facebook")?process.argv[5]:false
	}



require('./app/services')(app, config, databases.customers, auth);





