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
exports.common = {
	services: {
		twitter: {
			consumer_key: 'STATE YOUR CONSUMER KEY HERE',
			consumer_secret: 'STATE YOUR CONSUMER SECRET HERE',
			cachetimeout: 1800000 // 30min - API Limit = 350 Requests per hour
		},
		facebook: {
			client_id: 'STATE YOUR CONSUMER KEY HERE',
			client_secret: 'STATE YOUR CONSUMER SECRET HERE',
			cachetimeout: 1800000 // 30min
		}
	}
};