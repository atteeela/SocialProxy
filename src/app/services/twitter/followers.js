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

module.exports = function (app, config) {

	app.get('/latest', function (req, res) {

		res.send("return followers");
	

	});
};