(function() {
    angular
        .module("adminCart")
        .controller("editController", editController);

        editController.$inject = [ "$state", "firebaseService", "productService", "$timeout", "toaster" ];

    function editController($state, firebaseService, productService, timeout, toaster) {
    
        var vm = this;
        vm.init = init;
        vm.product = [];
        vm.updateProduct = updateProduct;
        var key = null;

        vm.addVarient = addVarient;
        vm.categories = [];
        var categoryKey = null;
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
        
        

        function init() {
            key = $state.params.key;
            vm.varients = [];
            getProductDetails(key);
            vm.deliveryOptions = ["Pick-UP", "Delivery", "Free"];
            getCategories();
            
        }
        // set DropDown

        function getCategories() { 
            var promise = firebaseService.getData("category");
            promise.then(successGetData, faliureGetData);
        }

        function successGetData(data) {
            vm.categories = data;
            getSubCategory();
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

        // get product details
        function getProductDetails(key) {
            var promise = productService.getProductData(key, "products");
            promise.then(successData, failData);
        }
        
        function successData(data) {
            vm.product = data;
            vm.varients = vm.product.varients;
            var imageList = vm.product.image.length;
            for(i = 0; i< imageList; i++) {
                var imageName = vm.product.image[i].name;
                var nameArray = imageName.split("_"); 
                vm.product.image[i].name = nameArray[1];
            }
            databaseImageDetails = vm.product.image;
        }

        function failData() {
            toaster.pop("error", "Error!", "Failed to get Data RELOAD!!");
        }

        // aadd varient
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


        // managing upload Image
        function uploadFiles(files) {
            vm.uploader = null;
            if(files) {
                // vm.storeFiles.push(files);
                imageName = files.name;
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
                        var obj = {
                            name: imageName,
                            url: downloadURL
                        }
                        vm.product.image.push(obj);
                        imageDatabaseName = generateGuid(imageName);
                        var dataObj = {
                            name : imageDatabaseName,
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

        // delete Image
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

        function generateGuid(imageName) {
            return guid() + "_" + imageName;

            function guid() {
                return s4() + '-' + s4() + '-' + s4() + '-' + s4() ;
            }
            
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            
        }

       
        // update Product
        function updateProduct() {
            var imageData;
            if(databaseImageDetails.length == 0 || databaseImageDetails.length < 0) {
                toaster.pop("warning", "Image required", "please upload an image")
            } else {
                imageData = mapImageData(databaseImageDetails);
                firebase.database().ref().child("products").child(key).update({
                    category : vm.product.category,
                    subCategory : vm.product.subCategory,
                    name : vm.product.name,
                    price : vm.product.price,
                    discount : vm.product.discount,
                    tax : vm.product.tax,
                    varients : mapVariant(vm.varients),
                    description : vm.product.description,
                    image : imageData,
                    brandName : vm.product.brandName,
                    deliveryMethod : vm.product.deliveryMethod
                });
                toaster.pop("info", "Updated!!", "Category Updated!!");
                $state.go("adminCart.product");
            }
             
            
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

        // function cancel() {
        //     $state.go("adminCart.product");
        // }

    }

})()