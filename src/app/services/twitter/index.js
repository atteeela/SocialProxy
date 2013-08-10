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



module.exports = function (app, config) {
 
    var mw= {

        //TODO config via parameter
        config : config,

        // Middleware for checking whether a customer exists or not.
        // If so, we load the customer from the database and pass it
        // to the request object, so that the other routes can work
        // with this customer data.
        loadTwitterConfiguration : function (req, res, next) {


     
            var err = [];

            

            if(config.services.configViaHttpHeader){

                var fields = [  "twitter_access_token_key",
                                "twitter_access_token_secret" 
                    ];

                //error polling
                fields.forEach(function(obj) { 
                    if(!req.header(obj)) {
                        err.push(obj);
                    } 
                });

                //error log
                if(err.length > 0){

                    err.forEach(function(obj) { 
                        console.log('No ' + obj + ' defined');     
                    });
                    
                    res.send('There is an oops!\n',404); 

                } else {

					// Configure req.services.twitter.access_token_key and 
					// req.services.twitter.access_token_secret with http-header parameter
                	//console.log("Configure req.services.twitter.access_token_key and req.services.twitter.access_token_secret with stored parameter");
					req.twitterConfiguration = {    consumer_key: config.services.twitter.consumer_key,
                                                    consumer_secret: config.services.twitter.consumer_secret,
                                                    access_token_key: req.header('twitter_access_token_key'),
                                                    access_token_secret: req.header('twitter_access_token_secret')
                                                };
					next();

				}
				                


            } else {

                if(config.services.twitter.access_token_key && config.services.twitter.access_token_secret){

                	// Configure req.services.twitter.access_token_key and 
                	// req.services.twitter.access_token_secret with stored parameter
                	//console.log("Configure req.services.twitter.access_token_key and req.services.twitter.access_token_secret with stored parameter");
                   req.twitterConfiguration = {
                            consumer_key: config.services.twitter.consumer_key,
                            consumer_secret: config.services.twitter.consumer_secret,
                            access_token_key: config.services.twitter.access_token_key,
                            access_token_secret: config.services.twitter.access_token_secret
                        };
					next();

                } else {

                    console.log("Bad configuration of Twitter in services.js");
                    res.send('There is an oops!\n',404);  

                }
            }


			//console.log("Init Twitter with configured access_token_key and access_token_secret")

			

        }
    };

    	


    // Create the twitter api with middleware

	app.namespace('/tweets', mw.loadTwitterConfiguration,  function () {

		require('./tweets')(app, config);
	});

    app.namespace('/followers', mw.loadTwitterConfiguration,  function () {

        require('./followers')(app, config);
    });

};