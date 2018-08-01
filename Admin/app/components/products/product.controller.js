(function() {
    angular
        .module("adminCart")
        .controller("productController", productController);

        productController.$inject = ["$scope", "$state", "firebaseService", "$timeout", "toaster", "uploadManager", "$rootScope"];

        function productController($scope, $state, firebaseService, timeout, toaster, uploadManager, $rootScope) {

            var vm = this;
            vm.product = {};
            vm.categories = [];
            vm.getCategories = getCategories;
            vm.getSubCategory = getSubCategory;
            vm.addVarient = addVarient;
            var categoryKey = null;
            var subCategoryKey = null;
            vm.removeVarient = removeVarient;
            vm.image = [];
            vm.uploadFiles = uploadFiles;
            vm.addProduct = addProduct;
            vm.files= [];
            vm.percentage = 0; 

            vm.init= function(){
                getCategories();
                vm.deliveryOptions = ["Pick-UP", "Delivery", "Free"];
                vm.varients = [{ 
                    "name": '',
                    "value": []
                }];
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
                categoryKey = vm.product.category;
                var promise = firebaseService.getSubCategoryData(categoryKey);
                promise.then(successGetSubData, faliureGetSubData)
            }

            function successGetSubData(data) {
                vm.subCategories = data;
            }

            function faliureGetSubData(message) {
                toaster.pop("error", "Error!!", message);
            }

            function addVarient(index) {
                var varientLength = vm.varients.length - 1;
                if(vm.varients[varientLength].name !== "") {
                    var obj = {
                        "name": '',
                        "value": []
                    }
                    vm.varients.push(obj);
                } else {
                    toaster.pop("error", "Error!!", "current field empty");
                }
            }

            function removeVarient(index) {
                vm.varients.splice(index,1);
            }

            function uploadFiles(files) {
                vm.uploader = null;
                 storefiles = files;
                vm.product.imageUrl = [];
                if(files && files.length) {
                    for(i=0 ; i< files.length; i++) {
                        var storageRef = firebase.storage().ref();
                        var fireRef = storageRef.child("photos").child(storefiles[i].name).put(storefiles[i]);
                        getUrl(fireRef);
                        fireRef.on("state_changed", (snapshot)  => {
                                vm.uploader = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            }, 
                            function(error) {
                                toaster.pop("error", "Error","went wrong");
                            },
                            function() {
                                // getUrl(fireRef);
                            }
                        );
                    }
                }
            }

            function getUrl(fireRef) {
                firebaseService.getImageUrl(fireRef)
                    .then(function(downloadURL) {
                        vm.product.imageUrl.push(downloadURL);
                        console.log(vm.product.imageUrl)
                })

            }

            function addProduct() {
                firebase.database().ref().child("products").push({
                    category : vm.product.category,
                    subCategory : vm.product.subCategory,
                    name : vm.product.name,
                    price : vm.product.price,
                    discount : vm.product.discount,
                    tax : vm.product.tax,
                    varients : mapVariant(vm.varients),
                    descrption : vm.product.description,
                    ImageUrl : vm.product.imageUrl,
                    brandName : vm.product.brand,
                    deliveryMethod : vm.product.deliveryMethod
                })
            }

            function mapVariant(data) {
                var array = [];
                _.forEach(data, function(val){
                    var obj = {
                        name: val.name,
                        values: val.value 
                    }
                    array.push(obj);
                })
                return array;
            }

            $scope.files = [];
            $scope.percentage = 0;
            $scope.upload = function () {
                uploadManager.upload();
                $scope.files = [];
            };
            $rootScope.$on('fileAdded', function (e, call) {
                $scope.files.push(call);
                $scope.$apply();
            });
            $rootScope.$on('uploadProgress', function (e, call) {
                $scope.percentage = call;
                $scope.$apply();
            });
        
            vm.prog = {   
                "width" : $scope.percentage + "%"
            }
        }
})();