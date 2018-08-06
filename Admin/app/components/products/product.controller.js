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
            vm.progress = {};
            vm.product.tax = 0;
            vm.deleteImage = deleteImage;
            vm.storeFiles = [];
            vm.product.imageUrl = [];
            vm.product.discount = 0;
            vm.ImageData = [];
           vm.databaseImageUrl = [];

            vm.init= function(){
                getCategories();
                vm.deliveryOptions = ["Pick-UP", "Delivery", "Free"];
                vm.varients = [{ 
                    "name": '',
                    "value": []
                }];
                $("[data-toggle = 'popover']").popover();
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
                if(files) {
                    // vm.storeFiles.push(files);
                    imageName = files.name
                    var storageRef = firebase.storage().ref();
                    var fireRef = storageRef.child("photos").child(files.name).put(files);
                    getUrl(fireRef);
                }
            }

            function getUrl(fireRef) {
                vm.uploadName = fireRef.snapshot.ref.name;
                fireRef.on("state_changed", (snapshot)  => {
                    var status = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    vm.uploader = parseInt(status);
                    vm.progress = {   
                        "width" : vm.uploader + "%"
                    }
                },function(error) {
                    toaster.pop("error", "Error", "Something went wrong");

                },function() { 
                    firebaseService.getImageUrl(fireRef)
                    .then(function(downloadURL) {
                        timeout(function() {
                            vm.databaseImageUrl.push(downloadURL);
                            vm.product.imageUrl.push({
                                name: imageName,
                                url: downloadURL
                            });
                            console.log(vm.product.imageUrl)
                        },10)
                    })

                })
            }

            function deleteImage(file, index) {
                vm.databaseImageUrl.splice(index, 1);
                vm.product.imageUrl.splice(index,1);
                firebaseService.deleteImage(file)
                    .then(successDelete, errorDelete);
            }
            function successDelete(){
                toaster.pop("info", "Delete", "Delete successsfully");
                timeout(function() { 
                    vm.uploader = null;
                },10)    
            }
            function errorDelete(){
                toaster.pop("error", "error", "Delete not success");
            }

            function addProduct() {
                firebase.database().ref().child("products").push({
                    category : vm.product.category,
                    subCategory : vm.product.subCategory,
                    name : vm.product.name,
                    price : vm.product.price,
                    discount : vm.product.discount.toFixed(2),
                    tax : vm.product.tax,
                    varients : mapVariant(vm.varients),
                    descrption : vm.product.description,
                    ImageUrl : vm.databaseImageUrl,
                    brandName : vm.product.brand,
                    deliveryMethod : vm.product.deliveryMethod
                })
                vm.product = {};
                vm.varients = [{ 
                    "name": '',
                    "value": []
                }];
                vm.storeFiles = [];
                $scope.product.$setPristine();
                vm.product.discount = 0;
                vm.product.tax = 0;
                toaster.pop("info", "saved", "new product added")
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

            
            
        
            
        }
})();