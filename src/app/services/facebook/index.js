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

        loadTwitterConfiguration : function (req, res, next) {

            res.send('Authentificate Facebook!\n'); 

        }
    };

    	
	// The connections array holds all open customer connections
	// to the Twitter API, which are accessable via connections[customerId].

    // Create the twitter api communication object.



	app.namespace('/posts', mw.loadTwitterConfiguration,  function () {

		//require('./posts')(app, config);
	});



};