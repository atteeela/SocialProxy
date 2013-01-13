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

var caches = require('memory-cache');

module.exports = function (app, config, twitterAPIConnection) {

	console.log('init tweet2');

	var helpers = {
		scraper : function (origin) {
			return {
				id: origin.id,
				text: origin.text,
				created_at: origin.created_at
			};
		}
	};
	app.get('/latest', function (req, res) {
		console.log('call latest');



		var customerId = 'konexmedia',
		    cacheId = 'twitter_tweets_latest_' + customerId,
			tweets = '',
		    twitterAPI = twitterAPIConnection;

		if (!tweets) {
			twitterAPI.getUserTimeline(function (err, data) {
				var tweets = [];

				data.forEach(function (tweet) {
					tweet = helpers.scraper(tweet);

					tweets.push(tweet);
				});

				// Add to cache.
				caches.put(cacheId, tweets, config.services.twitter.cachetimeout);

				// TODO: Exception handling.
				if(tweets){
					res.send(tweets);}
			});
		} else {
			res.send(tweets);
		}
	});
};