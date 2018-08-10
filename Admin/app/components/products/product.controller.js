(function() {
    angular
        .module("adminCart")
        .controller("productController", productController);
 
        productController.$inject = ["$scope", "$state", "productService", "firebaseService", "$timeout", "toaster", "$anchorScroll", "$location"];

        function productController($scope, $state, productService, firebaseService, timeout, toaster, $anchorScroll, $location) {
            var vm = this;

            vm.init = init;
            vm.goToAdd = goToAdd;
            vm.editRow = editRow;
            vm.deleteRow = deleteRow;

            function init() {
                vm.productTableData = {
                    data: [], 
                };
                getProductData();
                $location.hash();
                $anchorScroll();
            }

            function goToAdd() {
                $state.go("adminCart.add");
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
                            },10);
                        })
                    })
                })
            }

            function editRow(item) {
                var key = item.key
                $state.go("adminCart.edit", {key});
            }

            function deleteRow(item, index) {

                productService.getKeyName(item.key, "products", function(image) {
                    imageArr = image;
                    var imageList = imageArr.length;
                    for(i = 0; i< imageList; i++) {
                        var imageName = imageArr[i].name;
                        var nameArray = imageName.split("_"); 
                        imageArr[i].name = nameArray[1];

                        firebaseService.deleteImage(imageArr[i])
                            .then(successDelete, errorDelete);

                        function successDelete() {
                            firebase.database().ref().child("products").child(item.key).remove();
                            toaster.pop("info", "Delete", "Delete successsfully");    
                            getProductData();
                        }

                        function errorDelete() {
                            toaster.pop("error", "error", "Delete not success");
                        }
                    }

                })
                
                // vm.productTableData.data.splice(index, 1);

            }
        }
})()