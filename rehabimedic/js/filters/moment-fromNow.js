'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
  .filter('fromNow', function() {
    return function(date) {
      return moment(date,"H:i m/d/Y").fromNow();
    }
  })

.filter('minLength', function(){
  return function(input, len, pad){
    input = input.toString(); 
    if(input.length >= len) return input;
    else{
      pad = (pad || 0).toString(); 
      return new Array(1 + len - input.length).join(pad) + input;
    }
  };
})

.filter('dateRange', function() {
	return function(input, startDate, endDate) {
		
		var retArray = [];
        retArray.total = 0;
		
		angular.forEach(input, function(obj){
			var receivedDate = obj.factura_fecha;
			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
                retArray.total = retArray.total + parseFloat(obj.factura_total);
			}
		});
		return retArray; 
	};
});