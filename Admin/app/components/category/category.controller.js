(function() {
    angular
        .module("adminCart")
        .controller("categoryController", categoryController);

        categoryController.$inject = ["$scope", "$state", "firebaseService", "$timeout", "toaster"];

        function categoryController($scope, $state, firebaseService, timeout, toaster) {

            var vm = this;

            vm.category = {};
            vm.editingData = {};
            var currentuser = firebaseService.getCurrentUser();
           

            vm.init = function(){
                vm.gridOptions = {
                    data: [], 
                    urlSync: true
                };
                vm.collectionName = "category"
                getCategories(vm.collectionName);
                vm.addButton = true;
                
            } 

            function getCategories() {
                var categoryList = firebase.database().ref().child(vm.collectionName);
                categoryList.on('value', snapshot => {
                    timeout(function () {
                        if(snapshot.exists()) {
                            vm.gridOptions.data =_.map(snapshot.val(), function(obj, key){
                                obj.key = key
                                return obj 
                            })

                        } else {
                            toaster.pop("error", "Error", "No category exists");
                        }
                    },10);
                });
            }
  
            vm.addCategory = function() {
                vm.category = {};
                var obj = { 
                    "isNew": true
                }
                vm.gridOptions.data.push(obj);
                vm.addButton = false;
            }
            

            vm.saveCategory = function() {
                var dataExist = false;
                for(var i = 0; i < vm.gridOptions.data.length; i++) {
                    if(vm.gridOptions.data[i].name === vm.category.name && vm.gridOptions.data[i].key!=null){
                        dataExist = true;
                        break;
                    }
                }
                if(dataExist) {
                    toaster.pop("error", "Error", "category alreadyexists");
                } else {
                    firebase.database().ref().child("category").push({  
                        name : vm.category.name,
                        description : vm.category.description
                    });
                    toaster.pop("info", "Saved!!", "Category Added!!");
                    vm.addButton = true;
                }
            }

            vm.delete = function(item) {
                firebase.database().ref().child("category").child(item.key).remove();
                toaster.pop("error", "Delete", "category Deleted");
            }

            vm.edit = function(index) {
                vm.category = vm.gridOptions.data[index];   
                vm.gridOptions.data[index].isNew = true;
            };
        
            vm.updateRow =  function(item) {
                firebase.database().ref().child("category").child(item.key).update({
                    name : vm.category.name,
                    description : vm.category.description
                });
                toaster.pop("info", "Updated!!", "Category Updated!!");
                vm.category = {};
            }
            
            vm.cancelNewRow = function(index) {
                vm.addButton = true;
                _.forEach(vm.gridOptions.data, function(value){
                    value.isNew = false;
                })
                vm.gridOptions.data.splice( index, 1 );
                vm.category = {};
            }

            vm.CancelUpdate = function(index) {
                vm.category = {};
                vm.gridOptions.data[index].isNew = false;
            }
        }
})();