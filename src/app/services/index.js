 /*!
 * OpenProxy
 *
 * Copyright(c) 2012 Konex Media, Stuttgart, Germany
 *
 * Author:
 *     Robert Böing<robert.boeing@konexmedia.com>
 *
 * MIT Licensed
 *
 */


var path         = require('path'),
 passport         = require('passport'),
 TwitterStrategy  = require('passport-twitter').Strategy;


 module.exports = function(app,config){


 	console.log('init services');

 	    // Twitter authentication system.
    app.namespace('/twitter', function () {

    	console.log('init TwitterStrategy');

        passport.use(new TwitterStrategy({
            consumerKey: config.services.twitter.consumer_key,
            consumerSecret: config.services.twitter.consumer_secret,
            callbackURL: config.environment.domain + 'twitter/authenticated'
        }, function (token, secret, profile, done) {

            var twitterId = profile.username,
	            customer,
	            customerId;
				customer = customerData;

	        customerId = "konexmedia";
	        customer.services.twitter.oauth.token = "80032200-X4S5kUPQvBVxT3W9zjdLMl8W2xhaKGjdKVtAeSLw";
            customer.services.twitter.oauth.secret = "gKZdgu6LzB7XjyV4T3CgVWDWSOkzHH1Or84iaQQONg";

  
        }));

		require('./twitter')(app, config);
    
    });


        
 };

