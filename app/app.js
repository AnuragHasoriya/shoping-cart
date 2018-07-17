(function() {
    "use strict"
    var app = angular
        .module("shoppingCart", ["ui.router", "ngAnimate", "firebase", "toaster"]);
    
    app.config(configMain).run(runBlock);

    configMain.$inject = ["$urlRouterProvider"];

    function configMain($urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
    }

    runBlock.$inject = ["$state", "$rootScope"];

    function runBlock($state, $rootScope) {

    };
 
})();
