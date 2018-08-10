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
            //     var promise = firebaseService.checkUserExist();
            //     promise.then(idspresent, noids);  
            // }
            // function idspresent() {
                firebaseService.signIn(vm.user.email, vm.user.password)
                .then(logInSuccess)
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == "auth/wrong-password") {
                        toaster.pop("error", "Error", "Password id wrong");
                    } else {
                        $timeout(function(){
                            toaster.pop("error", errorCode, errorMessage);
                        },10)
                        
                    }
                })
            }
            // function noids(msg) {
            //     toaster.pop("error", "Error!", msg);
            // }

            function logInSuccess() {
                toaster.pop("info", "LoggedIn!!", "Login Successfull Welcome!!");
                $timeout(function() {
                    $state.go("adminCart.dashboard");
                }, 300);
            }

            // function logInFail(error) {
            //     var errorCode = error.code;
            //     var errorMessage = error.message;
            //     if (errorCode == "auth/wrong-password") {
            //         alert ("Password id wrong");
            //     } else {
            //         toaster.pop("error", "Error", errorMessage);
            //     }
            // }

        }
}) ();