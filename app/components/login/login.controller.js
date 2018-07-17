(function () {
    "use strict"
    angular
        .module("shoppingCart")
            .controller("loginController", loginController);

        loginController.$inject = ["$state", "firebaseService", "toaster", "$timeout"];

        function loginController($state, firebaseService, toaster, $timeout ) {

            var vm = this;
            vm.user = {};

            vm.jumpToRegistration = function() {
                $state.go("register")
            }

            vm.loginUser = function() {
                var currentUser = firebaseService.getCurrentUser();
                var emailVerified = currentUser != null ? user.emailVerified : false;
                if(emailVerified) {
                    firebaseService.signIn(vm.user.email, vm.user.password)
                    .then(firebaseServiceSuccess)
                    .catch(firebaseServiceFail);
                } else {
                    toaster.pop("error", "Error", "Please complete your profile");
                }
               
            }
        
            function firebaseServiceSuccess() {
                toaster.pop("info", "LoggedIn!!", "Login Successfull Welcome!!");
                $timeout(function() {
                    $state.go("shoppingCart.dashboard");
                }, 300);
            }

            function firebaseServiceFail(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == "auth/wrong-password") {
                    alert ("Password id wrong");
                } else {
                    toaster.pop("error", "Error", "Please complete your profile");
                }
            }
        } 
})();
