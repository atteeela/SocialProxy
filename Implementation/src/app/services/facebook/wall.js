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

module.exports = function (app, config, graph) {

	app.get('/', function (req, res) {
		var customer = req.customer,
		    profileId = customer.services.facebook.id,
		    token = customer.services.facebook.oauth.token,
		    cacheId = 'facebook_wall_' + customer.id,
			wallPosts = caches.get(cacheId);

		if (!wallPosts) {
			graph.apiCall('GET', '/' + profileId + '/feed', {access_token: token}, function (error, response, body) {
				if (error) {
					res.send(error, 500);
				}

				wallPosts = body.data;

				caches.put(cacheId, wallPosts, config.services.facebook.cachetimeout);

				res.send(wallPosts);
			});
		} else {
			res.send(wallPosts);
		}
	});
};