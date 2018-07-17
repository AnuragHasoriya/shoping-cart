(function() {
    "use strict"
    angular
        .module("shoppingCart")
            .controller("emailVerifyController", emailVerifyController);

        emailVerifyController.$inject = ["$scope", "$state", "firebaseService", "toaster", "$stateParams", "$timeout"];

        function emailVerifyController($scope, $state, firebaseService, toaster, $stateParams, $timeout) {

            var vm = this;

            vm.doVerify = function() {
                firebase.auth().applyActionCode($stateParams.oobCode)
                  .then(function(data) {
                    console.log(firebaseService.getCurrentUser().uid)
                    firebase.database().ref().child('users')
                      .child(firebaseService.getCurrentUser().uid)
                      .update({ emailVerified: true });
                    toastr.success('Verification happened', 'Success!');
                    $state.go('profile', {uid: firebaseService.getCurrentUser().uid});
                  })
                  .catch(function(error) {
                    $scope.error = error.message;
                    toastr.error(error.message, error.reason, { timeOut: 0 });
                  })
            };
        } 
})();