  var doLearning = function(obj) {

  		if(obj!='hallo')
           setTimeout(function() { doLearning('hallo') }, 1000)
       	else
           return 'yeah';
  };

  console.log(doLearning(false));