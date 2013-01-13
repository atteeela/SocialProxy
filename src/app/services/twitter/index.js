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

module.exports = function (app, config) {

	console.log('init twitter');

	// The connections array holds all open customer connections
	// to the Twitter API, which are accessable via connections[customerId].

    // Create the twitter api communication object.
    var twitter = new Twitter({
	    consumer_key: config.services.twitter.consumer_key,
	    consumer_secret: config.services.twitter.consumer_secret,
	    access_token_key: '80032200-X4S5kUPQvBVxT3W9zjdLMl8W2xhaKGjdKVtAeSLw',
	    access_token_secret: 'gKZdgu6LzB7XjyV4T3CgVWDWSOkzHH1Or84iaQQONg'
    });

	var  twitterAPIConnection = twitter;



		app.namespace('/tweets', function () {
			require('./tweets')(app, config, twitterAPIConnection);
		});
	


};