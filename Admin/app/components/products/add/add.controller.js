(function() {
    angular
        .module("adminCart")
        .controller("addController", addController);

        addController.$inject = ["$scope", "$state", "firebaseService", "$timeout", "toaster", "$rootScope"];

        function addController($scope, $state, firebaseService, timeout, toaster, $rootScope) {

            var vm = this;

            vm.addVarient = addVarient;
            vm.addProduct = addProduct;
            vm.categories = [];
            var categoryKey = null;
            vm.cancel = cancel;
            var databaseImageNameGuid = [];
            var databaseImageDetails = [];
            vm.deleteImage = deleteImage;
            vm.getCategories = getCategories;
            vm.getSubCategory = getSubCategory;
            vm.files= [];
            var imageName = null;
            var imageDatabaseName = [];
            vm.progress = {};
            vm.product = {};
            vm.product.tax = 0;
            vm.product.image = [];
            vm.product.discount = 0;
            vm.removeVarient = removeVarient;
            var subCategoryKey = null;
            vm.storeFiles = [];
            vm.uploadFiles = uploadFiles;
          
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

            function emptyVarient(index) {
                vm.varients.splice(index,1);
                vm.varients = [{ 
                    "name": '',
                    "value": []
                }];
            }

            function removeVarient(index) {
                vm.varients.splice(index,1);
            }

            function uploadFiles(files) {
                vm.uploader = null;
                if(files) {
                    // vm.storeFiles.push(files);
                    imageName = files.name;
                    var storageRef = firebase.storage().ref();
                    imageName = generateGuid(files.name)
                    var fireRef = storageRef.child("photos").child(imageName).put(files);
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
                            // var name = imageName.split("_"); 
                            // nameTrimed = name[1];
                            var obj = {
                                name: imageName,
                                url: downloadURL
                            }
                            vm.product.image.push(obj);
                            var dataObj = {
                                name : imageName,
                                url: downloadURL
                            }
                            databaseImageDetails.push(dataObj);
                            
                            console.log(vm.product.image)   
                        },10)
                    })
                    .catch(function(error) {
                        toaster.pop("error","Error",error);
                    })
                })
                
                
            }

            function deleteImage(file, index) {
                vm.product.image.splice(index, 1);
                databaseImageDetails.splice(index, 1)
                firebaseService.deleteImage(file)
                    .then(successDelete, errorDelete);
            }
            function successDelete() {
                toaster.pop("info", "Delete", "Delete successsfully");
                timeout(function() { 
                    vm.uploader = null;
                },10)    
            }
            function errorDelete(){
                toaster.pop("error", "error", "Delete not success");
            }

            function addProduct() {
                if(databaseImageDetails.length == 0 || databaseImageDetails.length < 0) {
                    toaster.pop("warning", "Image required", "please upload an image")
                } else {
                    firebase.database().ref().child("products").push({
                        category : vm.product.category,
                        subCategory : vm.product.subCategory,
                        name : vm.product.name,
                        price : vm.product.price,
                        discount : vm.product.discount,
                        tax : vm.product.tax,
                        varients : mapVariant(vm.varients),
                        description : vm.product.description,
                        image : mapImageData(databaseImageDetails),
                        brandName : vm.product.brandName,
                        deliveryMethod : vm.product.deliveryMethod
                    })
                    
                    toaster.pop("info", "saved", "new product added");
                    setData();
                    $state.go("adminCart.product");
                }
            }

            function generateGuid(imageName) {
                return guid() + "_" + imageName;

                function guid() {
                    return s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() ;
                }
                
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                }
                
            }

            function setData() {
                vm.product = {};
                vm.varients = [{ 
                    "name": '',
                    "value": []
                }];
                vm.storeFiles = [];
                $scope.product.$setPristine();
                vm.product.discount = 0;
                vm.product.tax = 0;
                vm.product.image = [];
                vm.uploader = null;
                databaseImageDetails = [];
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

            function mapImageData(data) {
                var array = [];
                _.forEach(data, function(val){
                    var obj = {
                        name: val.name,
                        url: val.url 
                    }
                    array.push(obj);
                })
                return array;
            }
            // product details

            function cancel() {
                if(vm.product.image.length == 0) {
                    $state.go("adminCart.product");
                } else {
                    toaster.pop("warning", "Delete photos","please delete the uploaded photos");
                }
            }
            

            
        }
})();