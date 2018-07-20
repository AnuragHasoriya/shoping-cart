(function() {
    angular
        .module("adminCart")
        .controller("productController", productController);

        productController.$inject = ["$state", "firebaseService", "$timeout"];

        function productController($state, firebaseService, timeout) {

            var vm = this;
        }
})();