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

var cache = require('../../lib/cache');
var extend = require('util')._extend;

module.exports = function (app, config) {

    var mw= {

        //TODO config via parameter
   
        loadTwitterConfiguration : function (req, res, next) {

            console.log('loadTwitterConfiguration');
            console.log(config.services.twitter );

            req.config = { services: { twitter : extend({},config.services.twitter) }};
            
            if(typeof req.header('access_token_key') != "undefined") 
                req.config.services.twitter.access_token_key = req.header('access_token_key');

            if(typeof req.header('access_token_secret') != "undefined") 
                req.config.services.twitter.access_token_secret = req.header('access_token_secret');

			req.config.cache_id = req.url + req.config.services.twitter.access_token_key;

            next();

        }

    };

    // Create the twitter api with middleware

	app.namespace('/tweets', mw.loadTwitterConfiguration,  function () {
        var tweets = require('./tweets');

        app.get('/latest', function (req, res) {
            
            cache.use(req,res,config,tweets.latest);

        });   
	
    });

    app.namespace('/followers', mw.loadTwitterConfiguration,  function () {

        require('./followers')(app, config);
    });

};