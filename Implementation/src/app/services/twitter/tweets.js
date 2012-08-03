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

module.exports = function (app, config, twitterAPIConnections) {

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
		var customer = req.customer,
		    cacheId = 'twitter_tweets_latest_' + customer.id,
			tweets = caches.get(cacheId),
		    twitterAPI = twitterAPIConnections[customer.id];

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
				res.send(tweets);
			});
		} else {
			res.send(tweets);
		}
	});
};