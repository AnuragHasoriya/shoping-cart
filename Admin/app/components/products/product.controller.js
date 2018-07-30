(function() {
    angular
        .module("adminCart")
        .controller("productController", productController);

        productController.$inject = ["$state", "firebaseService", "$timeout"];

        function productController($state, firebaseService, timeout) {

            var vm = this;
            vm.product = {};
            vm.categories = [];
            vm.getCategories = getCategories;
            vm.getSubCategory = getSubCategory;
            vm.addVarient = addVarient;
            var categoryKey = null;

            vm.init= function(){
                getCategories();
                vm.deliveryOptions = ["Pick-UP", "Delivery", "Free"];
                vm.varient = {
                    name : []
                }
            }

            function getCategories() { 
                var promise = firebaseService.getData("category");
                promise.then(successGetData, faliureGetData);
            }

            function successGetData(data) {
                vm.categories = data;
            }
  
            function faliureGetData(message){
                toaster.pop("error", "Error", message);
            }

            function getSubCategory() {
                var categoryKey = vm.product.category;
                var promise = firebaseService.getSubCategoryData(categoryKey);
                promise.then(successGetSubData, faliureGetSubData)
            }

            function successGetSubData(data) {
                vm.subCategories = data;
            }

            function faliureGetSubData(message) {
                toaster.pop("error", "error!!", message);
            }

            function addVarient() {
                // vm.varient = {};
                var obj = { 
                    "isNew": true
                }
                vm.varient.name.push(obj);
            }

        }
})();