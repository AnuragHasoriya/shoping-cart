(function() {
    angular
        .module("shoppingCart")
        .controller("profileController", profileController);

    profileController.$inject = ["$state", "$log", "$firebase", "toaster","firebaseService","$location"];

    function profileController($state, $log, $firebase, toaster, firebaseService, $location) {
       
        var vm = this;
        vm.uid = $state.params.uid;

        vm.saveProfile = function(){
            $pf.user.uid = vm.uid;
            firebase.database().ref('user_profile').save($pf.user).then().catch();
        }
        
    }
}) ();