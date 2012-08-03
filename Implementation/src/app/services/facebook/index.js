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

"use strict";

var graph = require('facebook-js');

module.exports = function (app, config, customersDB) {

	var mw = {
		checkIfActive : function (req, res, next) {
			var customer = req.customer;

			if (!customer.services.facebook.active) {
				res.send('Facebook is not active for the customer "' + customer.name + '".');
			} else if (!customer.services.facebook.oauth.token) {
				res.send('The customer did not activate the account yet.');
			} else {
				next();
			}
		}
	};

	app.namespace('/facebook', function () {
		app.namespace('/friends', mw.checkIfActive, function () {
			require('./friends')(app, config, graph);
		});

		app.namespace('/wall', mw.checkIfActive, function () {
			require('./wall')(app, config, graph);
		});
	});
};