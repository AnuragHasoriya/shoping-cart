(function() {
    "use strict"
    angular
        .module("shoppingCart")
            .controller("registrationController", registrationController);

        registrationController.$inject = ["$state", "firebaseService", "toaster", "$timeout"];

        function registrationController($state, firebaseService, toaster, $timeout) {

            var vm = this;
            vm.user = {};
            vm.anurag = function() {
                $("[data-toggle = 'popover']").popover();
            };

            vm.path = 'http://localhost:9090';

            vm.registerUser = function() {
                firebaseService.signUp(vm.user.email, vm.user.password)
                    .then(firebaseServiceSuccess)
                    .catch(firebaseServiceFail);
            }
            
            function firebaseServiceSuccess(user) {
                var currentuser = firebase.auth().currentUser;
                firebaseService.emailVerify(currentuser)
                    .then(emailVerifySuccess)
                    .catch(emailVerifyFaliure);
            }

            
            function firebaseServiceFail(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == "auth/weak-password") {
                   toaster.pop("error", "Error!", "Weak Password");
                alert("weak password");
                } else {
                    toaster.pop("error", "Error!", "Please try again");
                    alert(errorMessage);
                }
            }   

            function emailVerifySuccess() {
                // alert("please check your email");
                toaster.pop("info", "Email verify", "Please check your mail");
                $timeout(function() {
                    $state.go("login");
                }, 1000)
            }

            function emailVerifyFaliure() {
                toaster.pop("error", "Error!", "Please try again");
                alert("unable to send email");
            }
        
        } 
})();