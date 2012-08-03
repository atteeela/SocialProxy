/*!
 * socialproxy
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 *
 * Author:
 *     André König <andre.koenig@konexmedia.com>
 *
 * MIT Licensed
 *
 */
module.exports = function (app, config, databases) {

	app.get('/', function (req, res) {
		res.render('hello/index');
	});

	// Init the administration area.
	require('./admin')(app, config, databases);

	// Init the services ...
	require('./services')(app, config, databases.customers);
};