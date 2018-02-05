var app =  angular.module('app')

  .constant("BASEURL", "http://10.0.0.5")
  //.constant("BASEURL", "https://rehabimedic.app/rehabimedic/public/index.php")
  //.constant("BASEURL", "https://test-dbrehabimedic.rehabimedic.local")

  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ]);
