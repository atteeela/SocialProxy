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

 module.exports = function(app,config){


    // Initialise Twitter
    app.namespace('/twitter', function (req, res){
    	
        require('./twitter')(app, config);
    
    });

    // Initialise Twitter
    app.namespace('/facebook', function (req, res){

        require('./facebook')(app, config);
    
    });


        
 };