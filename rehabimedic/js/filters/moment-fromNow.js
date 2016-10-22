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
});