(function() {
    angular
        .module("shoppingCart")
        .controller("headerController", headerController);

        headerController.$inject = ["$state", "firebaseService"];

        function headerController($state, firebaseService) {

            var vm = this;

            vm.logout = function() {
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
                alert(error);
            }
        }
})();