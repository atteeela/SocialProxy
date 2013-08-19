var events = require('events');
var ewait = require('ewait');

var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(0)

var functions;

/*
eventEmitter.on('cachePut', function(message){
  //functions();
  console.log("");
});
*/


var cache = {}
function now() { return (new Date).getTime(); }
var debug = false;
var hitCount = 0;
var missCount = 0;
var preput = [];
var cacheWaitingQueue = [];

exports.setPreput = function(key){
  preput[key] = true;
}

exports.delPreput = function(key){
  preput[key]=false;
}

exports.getPreput = function(key){
  return preput[key];
}



exports.put = function(key, value, time, timeoutCallback) {
  if (debug) console.log('caching: '+key+' = '+value+' (@'+time+')');
  var oldRecord = cache[key];
	if (oldRecord) {
		clearTimeout(oldRecord.timeout);
	}

	var expire = time + now();
	var record = {value: value, expire: expire};

	if (!isNaN(expire)) {
		var timeout = setTimeout(function() {
	    exports.del(key);
	    if (typeof timeoutCallback === 'function') {
	    	timeoutCallback(key);
	    }
	  }, time);
		record.timeout = timeout;
	}

	cache[key] = record;
  eventEmitter.emit('cachePut_'+key);
}





exports.del = function(key) {
  delete cache[key];
}

exports.clear = function() {
  cache = {};
}

exports.use = function(req,res,config,get) {
  
  getCacheData = function(){
    var data = cache[req.config.cache_id];
    if (typeof data != "undefined") {
      if (isNaN(data.expire) || data.expire >= now()) {
        if (debug) hitCount++;
        res.send(cache[req.config.cache_id].value);
        //res.send(data.value);
      } else {
        // free some space
        if (debug) missCount++;
        exports.del(req.config.cache_id);
      }
    } else {
        if(exports.getPreput(req.config.cache_id)){
          ewait.waitForAny(eventEmitter, function(err) {
            if (err != null) {
                console.log('Timeout!');
                exports.delPreput(req.config.cache_id);

            } else {
                console.log('Warten auf Trigger beendet!');
                res.send(cache[req.config.cache_id].value);

            }
          }, 'cachePut_'+req.config.cache_id, 3000);

        } else {
            //get uncached data 
            exports.setPreput(req.config.cache_id);

            get(req,function(data){
              exports.put(req.config.cache_id, data, 10000);
              exports.delPreput(req.config.cache_id);

              res.send(data);
              
            });

        }

    }
    
  };

  getCacheData();


  

  //return null;
}



exports.size = function() { 
  var size = 0, key;
  for (key in cache) {
    if (cache.hasOwnProperty(key)) 
      if (exports.get(key) !== null)
        size++;
  }
  return size;
}

exports.memsize = function() { 
  var size = 0, key;
  for (key in cache) {
    if (cache.hasOwnProperty(key)) 
      size++;
  }
  return size;
}

exports.debug = function(bool) {
  debug = bool;
}

exports.hits = function() {
	return hitCount;
}

exports.misses = function() {
	return missCount;
}
