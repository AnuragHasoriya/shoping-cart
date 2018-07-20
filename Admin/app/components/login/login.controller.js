(function() {
    "use strict"
    angular
        .module("adminCart")
            .controller("loginController", loginController);

        loginController.$inject = ["$state", "toaster", "$timeout", "firebaseService"];

        function loginController($state, toaster, $timeout, firebaseService) {
            var vm = this;
            vm.user= {};

            vm.loginUser = function() {
                firebaseService.signIn(vm.user.email, vm.user.password)
                    .then(logInSuccess)
                    .catch(logInFail)
            }

            function logInSuccess() {
                toaster.pop("info", "LoggedIn!!", "Login Successfull Welcome!!");
                $timeout(function() {
                    $state.go("adminCart.dashboard");
                }, 300);
            }

            function logInFail(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == "auth/wrong-password") {
                    alert ("Password id wrong");
                } else {
                    toaster.pop("error", "Error", "Please complete your profile");
                }
            }

        }
}) ();