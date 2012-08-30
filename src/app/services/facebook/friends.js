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


	app.get('/list', function (req, res) {
		var customer = req.customer,
		    profileId = customer.services.facebook.id,
		    token = customer.services.facebook.oauth.token,
		    cacheId = 'facebook_friendslist_' + customer.id,
			friendsList = caches.get(cacheId);

		if (!friendsList) {
			graph.apiCall('GET', '/' + profileId + '/friends', {access_token: token}, function (error, response, body) {
				if (error) {
					res.send(error, 500);
				}

				friendsList = body.data;

				friendsList.forEach(function (friend) {
					friend.picture = 'http://graph.facebook.com/' + friend.id + '/picture';
				});

				caches.put(cacheId, friendsList, config.services.facebook.cachetimeout);

				res.send(friendsList);
			});
		} else {
			res.send(friendsList);
		}
	});
};