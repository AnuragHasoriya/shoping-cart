(function () {
    "use strict"
    angular
        .module("shoppingCart")
            .controller("loginController", loginController);

        loginController.$inject = ["$state", "firebaseService", "toaster", "$timeout"];

        function loginController($state, firebaseService, toaster, $timeout ) {

            var vm = this;
            vm.user = {};

            // vm.jumpToRegistration = function() {
            //     $state.go("register")
            // }

            vm.loginUser = function() {
               
                    firebaseService.signIn(vm.user.email, vm.user.password)
                        .then(firebaseServiceSuccess)
                        .catch(firebaseServiceFail);
            }
        
            function firebaseServiceSuccess() {
                var currentUser = firebaseService.getCurrentUser();
                var emailVerified = currentUser != null ? currentUser.emailVerified : false;
                if(emailVerified) {
                    toaster.pop("info", "LoggedIn!!", "Login Successfull Welcome!!");
                    $timeout(function() {
                        $state.go("shoppingCart.dashboard");
                    }, 1000);
                } else {
                    toaster.pop("error", "Error", "Please complete your profile");
                }
            }

            function firebaseServiceFail(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == "auth/wrong-password") {
                    alert ("Password id wrong");
                } else {
                    toaster.pop("error", "Error", "Please check your mail");
                }
            }
        } 
})();
