(function() {
    angular
    .module("adminCart")
    .controller("setInventoryController", setInventoryController);

    setInventoryController.$inject = ["$scope", "$state", "productService", "firebaseService", "$timeout", "toaster", "$anchorScroll", "$location"];

    function setInventoryController($scope, $state, productService, firebaseService, timeout, toaster, $anchorScroll, $location) {
        var vm = this;
        var productKey = null;
        vm.init = init;
        var varients = null;
        var varientsArray = null;     
        vm.totalCount = null;   
        vm.setInventory = setInventory;
        vm.inputCon = null;
        vm.emptyRows = null;
        var inventoryArray = [];
        
        
        function init() {
            vm.productDetails = {};
            vm.inventoryVarients = {
                data: [], 
                pagination: {
                    itemsPerPage: '20'
                }
            };
            tableName = $state.params.table;
            key = $state.params.key; 
            if(tableName == "products") {
                var promise = productService.getProductData(key, tableName);
                promise.then(successGetData, faliureGetData);
            } else {
                var promise = productService.getProductData(key, tableName);
                promise.then(gotInventory, faliureGetData)
            }

        }

        function gotInventory(data) {
            // vm.inventoryVarients.data = data;
            key = data.key;
            tableName = "products";
            var promise = productService.getProductData(key, tableName);
                promise.then(successGetData, faliureGetData);
        }

        function successGetData(data) {
            var obj = data
            productService.getKeyName(data.category, "category", function(res){
                obj.categoryname = res;
                productService.getKeyName(data.subCategory, "subCategory", function(res){
                    obj.subCategoryName = res;
                    timeout(function() {
                        vm.productDetails = obj;
                        varients = vm.productDetails.varients;
                        sortVarients(varients);
                    },10);
                })
            })
        }

        function sortVarients(varients) {
            varientsArray = [];
            varients.forEach(function(varient) {
                varientsArray.push(_.map(varient.values,"value"))
            })
            vm.inventoryVarients.data = product(varientsArray);
            var arr = [];
            vm.inventoryVarients.data.forEach(function(val) {
                var singleVal = "";
                val.forEach(function(data) {
                    singleVal = singleVal + data
                })
                var obj = {
                    "varient" : singleVal,
                    "value" : null
                }
                arr.push(obj);
            })
            vm.inventoryVarients.data = arr;
        }
        
        function setInventory(arr) {
            var count = null;
            if(vm.totalCount) {
                inventoryArray = arr.data; 
                inventoryArray.forEach(function(data) {
                    if(data.value == undefined) {
                        vm.inputCon = true;
                        vm.emptyRows = vm.emptyRows + 1; 
                    } else {
                        count = count + data.value;
                    }
                })
                if(vm.totalCount = count) {
                    firebase.database().ref().child("inventory").push({
                        productkey : productKey,
                        stock : inventoryArray,
                        totalStock : vm.totalCount
                    })
                    $state.go("adminCart.inventory")
                } 
                else {
                    vm.chechValues = true;
                } 
            } else {
                toaster.pop("error", "Error", "Total Varient Empty")
            }

        }

       





        function product(opts) {
            if (arguments.length === 1 && !_.isArray(opts))
                return _cartesianProductObj(opts)
            else if (arguments.length === 1)
                return _cartesianProductOf(opts)
            else
                return _cartesianProductOf(arguments)
        }
        
        function _cartesianProductObj(optObj) {
            var keys = _.keys(optObj);
            var opts = _.values(optObj);
            var combs = _cartesianProductOf(opts);
            return _.map(combs,function(comb) {
                return _.zipObject(keys,comb);
            });
        }
        
        function _cartesianProductOf(args) {
            if (arguments.length>1) args=_.toArray(arguments);
        
            // strings to arrays of letters
            args=_.map(args, opt => typeof opt==='string'?_.toArray(opt):opt)
        
            return _.reduce(args, function(a, b) {
                return _.flatten(_.map(a, function(x) {
                    return _.map(b, function(y) {
                        return _.concat(x,[y]);
                    });
                }), true);
            }, [ [] ]);
        }

        function faliureGetData(message){
            toaster.pop("error", "Error", message);
        }


    }


})();