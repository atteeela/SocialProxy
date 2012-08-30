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

var Twitter = require('ntwitter');

module.exports = function (app, config, customersDB) {

	// The connections array holds all open customer connections
	// to the Twitter API, which are accessable via connections[customerId].
	var twitterAPIConnections = [],
	    mw = {
		    checkIfActive : function (req, res, next) {
			    var customer = req.customer,
			        twitter;

			    if (!customer.services.twitter.active) {
				    res.send('Twitter is not active for the customer "' + customer.name + '".');
			    } else if (!customer.services.twitter.oauth.token) {
				    res.send('The customer did not activate the account yet.');
			    } else {

				    // Create the twitter api communication object.
				    twitter = new Twitter({
					    consumer_key: config.services.twitter.consumer_key,
					    consumer_secret: config.services.twitter.consumer_secret,
					    access_token_key: customer.services.twitter.oauth.token,
					    access_token_secret: customer.services.twitter.oauth.secret
				    });

				    twitter.verifyCredentials(function (err, data) {
					    if (err) {
						    res.send('Twitter API answered with: ' + JSON.stringify(err));
					    }

					    twitterAPIConnections[customer.id] = twitter;

					    next();
				    });
			    }
		    }
	    };

	app.namespace('/twitter', function () {

		app.namespace('/tweets', mw.checkIfActive, function () {
			require('./tweets')(app, config, twitterAPIConnections);
		});
	});
};