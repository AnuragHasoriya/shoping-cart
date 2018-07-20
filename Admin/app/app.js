(function() {
    var app = angular
        .module("adminCart", ["ui.router", "ngAnimate", "firebase", "toaster"]);

    app.config(configMain)
        .run(runBlock);

    function configMain($urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
    }
    
    configMain.$inject = ["$urlRouterProvider"];
    
    runBlock.$inject = ["$state", "$rootScope"];
    
    function runBlock($state, $rootScope) {
    
    };

})();