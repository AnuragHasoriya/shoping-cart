'use strict';

(function () {
  'use strict';

  angular
    .module('shoppingCart')
      .controller('LoadingCtrl', LoadingCtrl);

  LoadingCtrl.$inject = ['$scope', '$timeout', '$state'];
  
  function LoadingCtrl($scope, $timeout, $state) {
  
    var vm = {};
  
    $scope.vm = vm;
    $scope.vm.redirect = redirect;

    function redirect() {
      $timeout(function () {
        
        var currentUser = firebase.auth().currentUser;
        var emailVerified;
        if(currentUser != null) {
          emailVerified = currentUser.emailVerified;
        }
        if (currentUser && (emailVerified == true)) {
            $state.go('shoppingCart.dashboard');
        } else {
            $state.go('login');
        }
      }, 300);
    }
  }
})();