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
    Twitter = require('simple-twitter');

exports.latest = function (req,callback) {

	var api = new Twitter(	req.config.services.twitter.consumer_key,
							req.config.services.twitter.consumer_secret,
							req.config.services.twitter.access_token_key,
							req.config.services.twitter.access_token_secret);


	api.get('statuses/user_timeline', '?trim_user=true', function(err, data) {

		//console.log(req.config.services.twitter);



		data = JSON.parse(data);
		var tweet,tweets = [];
		if(!err){
			data.forEach(function (tweet) {					
				tweet = helpers.tweet(tweet);
				tweets.push(tweet);
			});
			console.log('originaldaten von Twitter abgerufen');
			callback(tweets);
		}else{
			console.log('Fehler:'+err);
			callback(err);
		}

		

	});


};













/*
	app.get('/latest', function (req, res) {
		var cacheId = 'twitter_tweets_latest_' + config.services.twitter.configuration.consumer_key,
			tweets=[];


		var get = function(callback){


			//create a Twitter-API-Object

			var twitterAPI = new Twitter(config.services.twitter.configuration),
				tweets = [];

				 
		};

		var render = function(data){
			res.send(data);
		}
			
		cache.get(req,get,render);

	});




/*			


			setTimeout(function(){
				console.log('originaldaten von Twitter abgerufen');
				tweets.push({value:'Daten von Twitter'});
				callback(tweets);
			},2000);

//caches.setPreput(cacheId);
			//create a Twitter-API-Object
			var twitterAPI = new Twitter(req.twitterConfiguration),
				tweets = [];

			twitterAPI.get('statuses/user_timeline', {trim_user: 'true'}, function(err, data) {
				var tweet;
				if(!err){
					data.forEach(function (tweet) {					
						tweet = helpers.scraper(tweet);
						tweets.push(tweet);
					});
					res.send(tweets);
					caches.put(cacheId, tweets, config.services.twitter.cachetimeout);
					caches.delPreput(cacheId);
					console.log('originaldaten von Twitter abgerufen');
				}else{
					console.log('Fehler:'+err);
				}

			});
*/

/*

		if(!caches.getPreput(cacheId) && !caches.get(cacheId))
			getNewTweets();
		else if(!caches.get(cacheId))
			caches.addRessourceToCacheWaitingQueue(res)
		else	
*/
