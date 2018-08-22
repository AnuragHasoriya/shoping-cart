(function() {
    angular
    .module("adminCart")
    .controller("inventoryController", inventoryController);

    inventoryController.$inject = ["$scope", "$state", "productService", "firebaseService", "$timeout", "toaster", "$anchorScroll", "$location"];

    function inventoryController($scope, $state, productService, firebaseService, timeout, toaster, $anchorScroll, $location) {
        var vm = this;


    }


})();