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

var caches = require('memory-cache');
var Twitter = require('mtwitter');

//little templating
var helpers = {
	scraper : function (origin) {
		return {
			id: origin.id,
			text: origin.text,
			created_at: origin.created_at
		};
	}
};

//caches.debug(true);

module.exports = function (app, config) {
	app.get('/latest', function (req, res) {
			
		var cacheId = 'twitter_tweets_latest_' + req.twitterConfiguration.consumer_key,
			tweets=[];

		var get = function(callback){

			setTimeout(function(){
				console.log('originaldaten von Twitter abgerufen');
				tweets.push({value:'Daten von Twitter'});
				callback(tweets);
			},2000);
				 
		};

		var render = function(data){
			res.send(data);
		}
			
		caches.get(cacheId,get,render);

	});

};



/*			//caches.setPreput(cacheId);
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
