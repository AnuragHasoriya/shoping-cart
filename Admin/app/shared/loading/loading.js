'use strict';

(function () {
  'use strict';

  angular
    .module('adminCart')
      .controller('LoadingController', LoadingController);

    LoadingController.$inject = ['$scope', '$timeout', '$state'];
  
  function LoadingController($scope, $timeout, $state) {
  
    var vm = {};
  
    $scope.vm = vm;
    $scope.vm.redirect = redirect;

    function redirect() {
      $timeout(function () {
        
        var currentUser = firebase.auth().currentUser;
        if(currentUser != null) {
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              $state.go("adminCart.dashboard");
            } else {
              $state.go('login');
            }
          });
        } else {
          $state.go('login');
        }
      },300)
    }
  }
})();