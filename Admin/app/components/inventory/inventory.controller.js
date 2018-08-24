(function() {
    angular
    .module("adminCart")
    .controller("inventoryController", inventoryController);

    inventoryController.$inject = ["$scope", "$state", "firebaseService", "productService", "$timeout", "toaster", "$anchorScroll", "$location"];

    function inventoryController($scope, $state, firebaseService, productService, timeout, toaster, $anchorScroll, $location) {
        var vm = this;
        vm.init = init;
        vm.goToAdd = goToAdd;
        vm.editInventory = editInventory;
        var productObject = [];
        var inventoryData =[];

        function goToAdd() {
            $state.go("adminCart.addInventory");
        }

        function init() {
            vm.products = {
                data: [],
                pagination: {
                    itemsPerPage: '10'
                }
            };

            var promise = firebaseService.getProductKey("inventory") 
            promise.then(productKeyData, emptyData);
           
        }

        function productKeyData(productKeys) {
            inventoryData = productKeys;
            productKeys.forEach(function(keysObj) {
                
                var promise = firebaseService.getProdForInvent(keysObj) 
                promise.then(productData, emptyData);
            })
           
        }

        function productData(tableData) {
            var obj = tableData
            productService.getKeyName(tableData.category, "category", function(res) {
                obj.categoryname = res;
                productService.getKeyName(tableData.subCategory, "subCategory", function(res) {
                    obj.subCategoryName = res;
                    timeout(function() {
                        vm.products.data.push(obj);
                    },1)
                })
            })
        }

        function editInventory(item) {
            inventoryData.forEach(function(obj) {
                key = obj.key
                if(obj.productkey == item.key) {
                    $state.go("adminCart.setInventory", {table:"inventory", key })
                }
            })
            console.log(item)
        }

        function emptyData() {
            toaster.pop("error", "Errorr", "SomeThing went wrong please refresh");
        }

    }


})();