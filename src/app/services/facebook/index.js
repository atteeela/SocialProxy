/*!
 * socialproxy
 *
 * Copyright(c) 2013 konexmedia, Hechingen, Germany
 *
 * Author:
 *     Robert Böing <robert.boeing@konexmedia.com>
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
   
        loadFacebookConfiguration : function (req, res, next) {


            req.config = { services: { facebook : extend({},config.services.facebook) }};
            
            if(typeof req.header('user') != "undefined") 
                req.config.services.facebook.user = req.header('user');

            req.config.cache_id = req.url + req.config.services.facebook.user;

            next();

        }

    };

    // Create the facebook api with middleware

    app.namespace('/posts', mw.loadFacebookConfiguration,  function () {
        var tweets = require('./posts');

        app.get('/latest', function (req, res) {
            
            cache.use(req,res,config,tweets.latest);

        });   
    
    });

};