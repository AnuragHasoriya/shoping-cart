(function() {
    angular
    .module("adminCart")
    .controller("productListController", productListController);

    productListController.$inject = ["$scope", "$state", "productService", "firebaseService", "$timeout", "toaster", "$anchorScroll", "$location"];

    function productListController($scope, $state, productService, firebaseService, timeout, toaster, $anchorScroll, $location) {
        var vm = this;
        vm.init = init;
        vm.setInventory = setInventory;

        function init() {
            vm.productTableData = {
                data: [], 
                pagination: {
                    itemsPerPage: '10'
                }
            };
            getProductData();
            $location.hash();
            $anchorScroll();
        } 

        function getProductData() {
            vm.productTableData.data = [];
            var promise = firebaseService.getData("products");
            promise.then(successGetData, faliureGetData)
        }

        function successGetData(data) {
            mapTableData(data);
        }

        function faliureGetData(message){
            toaster.pop("error", "Error", message);
        }

        function mapTableData(data) {
            _.forEach(data, function(value){
                var obj = value
                productService.getKeyName(value.category, "category", function(res){
                    obj.categoryname = res;
                    productService.getKeyName(value.subCategory, "subCategory", function(res){
                        obj.subCategoryName = res;
                        timeout(function() {
                            vm.productTableData.data.push(obj)
                            console.log(vm.productTableData.data);
                        },10);
                    })
                })
            })
        }

        function setInventory(product) {
            key = product.key;
            $state.go("adminCart.setInventory", {table:"products", key});
        }

        
    }


})();