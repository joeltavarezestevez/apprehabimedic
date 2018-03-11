'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
  .filter('fromNow', function() {
    return function(date) {
    	moment.locale('es');
    	return moment(date).fromNow();
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
        retArray.balance = 0;
		
		angular.forEach(input, function(obj){
			var receivedDate = obj.factura_fecha;
			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
                retArray.total = retArray.total + parseFloat(obj.factura_total);
                retArray.balance = retArray.balance + parseFloat(obj.factura_balance);
			}
		});
		return retArray; 
	};
})

.filter('dateRangeCitas', function() {
	return function(input, startDate, endDate) {
		
		var retArray = [];
		
		angular.forEach(input, function(obj){
			var receivedDate = obj.cita_fecha_hora;
			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
			}
		});
		return retArray; 
	};
})

.filter('dateRangeConsultas', function() {
	return function(input, startDate, endDate) {
		
		var retArray = [];
		
		angular.forEach(input, function(obj){
			var receivedDate = obj.consulta_fecha;
			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
			}
		});
		return retArray; 
	};
})

.filter('dateRangePagos', function() {
	return function(input, startDate, endDate) {
		
		var retArray = [];
        retArray.total = 0;
		
		angular.forEach(input, function(obj){
			var receivedDate = obj.pago_fecha;
			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
                retArray.total = retArray.total + parseFloat(obj.pago_monto);
			}
		});
		return retArray; 
	};
})

.filter('dateRangeTerapias', function() {
	return function(input, startDate, endDate) {
		
		var retArray = [];
		
		angular.forEach(input, function(obj){
			var receivedDate = obj.paciente_terapia_fecha;
			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
			}
		});
		return retArray; 
	};
});