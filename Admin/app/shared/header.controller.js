(function() {
    angular
        .module("adminCart")
        .controller("headerController", headerController);

        headerController.$inject = ["$state", "firebaseService", "$timeout"];

        function headerController($state, firebaseService, timeout) {

            var vm = this;

            vm.logOut = function() {
                firebaseService.logOut()
                    .then(firebaseServiceSuccess)
                    .catch(firebaseServiceFail)
            }

            function firebaseServiceSuccess() {
                var currentUser = firebase.auth().currentUser;
                console.log(currentUser);
                $state.go("login");
            }

            function firebaseServiceFail(error) {
                toaster.pop("error", "Error", error)
            }

            // vm.openUserHeader = function(){
            //     vm.userDropMenu = '';
            //     timeout(function() {
            //         vm.userDropMenu = 'open';
            //     },10)
            // }
            // vm.userDropMenu = 'open'

            vm.openTab = function(ref){
                vm.tabs = ref;
            }
        }
})();