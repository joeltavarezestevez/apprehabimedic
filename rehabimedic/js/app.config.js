var app =  angular.module('app')
<<<<<<< HEAD
  //.constant("BASEURL", "https://rehabimedic.app/rehabimedic/public/index.php")
  .constant("BASEURL", "https://dbrehabimedic.rehabimedic.local")
=======
  .constant("BASEURL", "https://rehabimedic.app/rehabimedic/public/index.php")
  //.constant("BASEURL", "https://test-dbrehabimedic.rehabimedic.local")
>>>>>>> 57c03e109eecbfa30a0b5debc50616c9dccae16c
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
