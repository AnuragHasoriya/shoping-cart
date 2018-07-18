(function() {
    angular
        .module("shoppingCart")
        .controller("profileController", profileController);

    profileController.$inject = ["$state", "$log", "toaster", "firebaseService", "$location"];

    function profileController($state, $log, toaster, firebaseService, $location) {
       
        var vm = this;
        vm.uid = $state.params.uid;
        vm.user = {};

        vm.userProfile = function(){
            vm.user.uid = vm.uid;
            firebase.database().ref("user_profile").child( vm.user.uid).set({
                firstname : vm.user.firstname,
                lastname : vm.user.lastname,
                phoneno : vm.user.phoneno,
                dob : vm.user.dob.toString(),
            });
            $state.go("shoppingCart.dashboard");
        }

    }
}) ();

