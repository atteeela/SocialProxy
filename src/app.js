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


var express          = require('express'),
	expressNamespace = require('express-namespace'),
	passport         = require('passport'),
	Settings         = require('settings');





// Load the application settings

var config = {
	environment: new Settings(__dirname + '/config/environment.js').getEnvironment().environment,
	services: new Settings(__dirname + '/config/services.js').getEnvironment().services
};




// Initialise an express.js Webserver
var app = express.createServer();

// Configuration of this server
// at the moment we doesen't need more configuration

app.configure(function() {

    app.use(app.router);

});


// Start the listening process.
app.listen(process.env.PORT || config.environment.port || 80);

// Routing
var services = require('./app/services')(app,config);
