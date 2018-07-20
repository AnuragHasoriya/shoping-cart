(function() {
    angular
        .module("adminCart")
            .config(configRoutes)
            .run(runBlock);

    configRoutes.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

    function configRoutes($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state("adminCart", {
                cache : true,
                views : {
                    "" : {
                        templateUrl : "app/components/landing/landing.html"
                    },
                    "header@adminCart" : {
                        templateUrl : "app/shared/layout/header.html",
                        controller : "headerController as $hd"
                    },
                    "footer@adminCart" : {
                        templateUrl : "app/shared/layout/footer.html"
                    }
                }
            })
            .state("adminCart.dashboard", {
                cache : true,
                url : "/dashboard",
                views : {
                    "content" : {
                        // templateUrl : "app/components/dashboard/dashboard.html",
                        templateUrl : "app/components/products/product.html",
                        controller : "productController as $pc"
                    }
                }
            })
            .state("adminCart.products", {
                cache : true,
                url : "/products",
                views : {
                    "content" : {
                        templateUrl : "app/components/products/product.html",
                        controller : "productController as $pc"
                    }
                }   
            })
            .state('loading', {
                url: '/loading',
                cache: false,
                template: '<div ng-init="vm.redirect()"></div>',
                controller: 'LoadingController'
            })
            .state("login", {
                cache : true,
                url : "/login",
                templateUrl : "app/components/login/login.html",
                controller : "loginController as $lg"
            });
    }

    runBlock.$inject = ["$rootScope", "$transitions", "$state"];

    function runBlock($rootScope, $transitions, $state) {

        $transitions.onSuccess({ to : true}, ($transition) => {

            if($transition.$from() == $transition.$to()) {
                $state.go("loading");
            }

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) { 
                    var currentUser = user;
                    if(currentUser === null) {
                        if ($transition.$to().name !== 'login') {
                            $state.go("login");
                        }
                    } else if ($transition.$to().name === 'login') {
                        // $state.go('loading');
                        $state.go('login');
                    }
                    // else {
                    //     $state.go("loading");
                    // }
                } else  {
                        if($transition.$to().name === "register") {
                            $state.go("register");
                        } else {
                        $state.go("login");
                        }
                }
            });
        }
    )
    }
})();