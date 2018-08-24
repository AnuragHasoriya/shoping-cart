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
                        templateUrl : "app/components/dashboard/dashboard.html",
                        // controller : "categoryController as $cc"
                    }
                }
            })
            .state("adminCart.product", {
                cache : true,
                url : "/products",
                views : {
                    "content" : {
                        templateUrl : "app/components/products/product.html",
                        controller : "productController as $pc"
                    }
                }
            })
            .state("adminCart.add", {
                cache : true,
                url : "/products/add-new",
                views : {
                    "content" : {
                        templateUrl : "app/components/products/add/add.html",
                        controller : "addController as $adc"
                    }
                }
            })
            .state("adminCart.edit", {
                cache : true,
                url : "/products/edit/:key",
                views : {
                    "content" : {
                        templateUrl : "app/components/products/edit/edit.html",
                        controller : "editController as $edc",
                    }
                },
                // function($stateParams) {
                //     $stateParams.
                // }
            }) 
            .state("adminCart.category", {
                cache : true,
                url : "/category",
                views : {
                    "content" : {
                        templateUrl : "app/components/category/category.html",
                        controller : "categoryController as $cc"
                    }
                }
            })  
            .state("adminCart.inventory", {
                cache : true,
                url : "/inventory",
                views : {
                    "content" : {
                        templateUrl : "app/components/inventory/inventory.html",
                        controller : "inventoryController as $invc"
                    }
                }
            })  
            .state("adminCart.addInventory", {
                cache : true,
                url : "/inventory/add",
                views : {
                    "content" : {
                        templateUrl : "app/components/inventory/productList/productList.html",
                        controller : "productListController as $plc"
                    }
                }
            })
            .state("adminCart.setInventory", {
                cache : true,
                url : "/inventory/add/set/:table/:key",
                views : {
                    "content" : {
                        templateUrl : "app/components/inventory/setInventory/setInventory.html",
                        controller : "setInventoryController as $sic"
                    }
                }
            })
            .state('emailVerify', {
                cache : true,
                url: '/verify-email?mode&oobCode',
                templateUrl: 'app/components/auth/verify-email.html',
                controller: 'emailVerifyController as $emvr',
            })
            .state("profile", {
                cache : true,
                url : "/profile/:uid",
                templateUrl : "app/components/profile/profile.html",
                controller :"profileController as $pf",
                function($stateParams){
                    $stateParams.email;  
                }
            })
            .state("register", {
                cache : true,
                url : "/register",
                templateUrl : "app/components/register/register.html",
                controller : "registrationController as $rg"
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

        $transitions.onSuccess({to: true }, ($transition) => {
           
            if($transition.$from() == $transition.$to()) {
                $state.go('loading');
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
                } else  {        
                    $state.go("login");
                }
            });
        }
    )
    }
})();