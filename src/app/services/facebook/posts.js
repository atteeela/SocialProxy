/*!
 * socialproxy
 *
 * Copyright(c) 2013 Konex Media, Stuttgart, Germany
 *
 * Author:
 *     Robert Boeing <robert.boeing@konexmedia.com>
 *
 * MIT Licensed
 *
 */

"use strict";

var helpers = require('../../lib/helpers');
var util = require('util'),
    fbsdk = require('facebook-sdk');

exports.latest = function (req,callback) {

	var facebook = new fbsdk.Facebook({
	  appId  : req.config.services.facebook.client_id,
	  secret : req.config.services.facebook.client_secret
	});

	facebook.api(req.config.services.facebook.user + '/feed', function(data,err) {
	  
		var post,posts = [];
		if(!err){

			
			data.data.forEach(function (post) {					
				post = helpers.post(post);
				posts.push(post);
			});
			console.log('originaldaten von Facebook abgerufen');
			callback(posts);
		}else{
			console.log('Fehler:'+err);
			callback(err);
		}

	});

};


