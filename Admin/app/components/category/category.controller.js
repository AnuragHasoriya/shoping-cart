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
            var categoryTableName = null;
           
            vm.init = init;
            vm.updateSelection = updateSelection;
            vm.addCategory = addCategory;
            vm.saveCategory = saveCategory;
            vm.deleteRow = deleteRow;
            vm.editRow = editRow;
            vm.updateRow = updateRow;
            vm.cancelNewRow = cancelNewRow;
            vm.cancelUpdate = cancelUpdate;

            vm.subCategory = {};
            vm.editingSubData = {};
            var checkedItemData = null;
            vm.addSubCategory = addSubCategory;
            vm.saveSubCategory = saveSubCategory;
            vm.subDeleteRow = subDeleteRow;
            vm.subEditRow = subEditRow;
            vm.subUpdateRow = subUpdateRow;
            vm.subCancelUpdate = subCancelUpdate;
            vm.subCancelNewRow = subCancelNewRow;

            function init(){
                vm.categoryTableData = {
                    data: [], 
                };
                categoryTableName = "category"
                vm.subCategoryTableData = {
                    data: [], 
                };
                subCategoryTableName = "subCategory"
                getCategories();
                vm.addButton = true;
            }

            function updateSelection(object) {
                checkedItemData = object;
                _.forEach(vm.categoryTableData.data, function(data) {
                    data.checked =false;
                })
                object.checked = true;
                setSubCategory();       
            }

            // function getCategories() {
            //     firebaseService.getData("category", function(res){
            //         successGetData(res)
            //     })
            // }
            function getCategories() {
                vm.categoryTableData.data =[];
                vm.subCategoryTableData.data =[];
                var promise = firebaseService.getData(categoryTableName);
                promise.then(successGetData, faliureGetData)
            }

            function successGetData(data) {
                timeout(function() {
                    vm.categoryTableData.data = data;
                },10);
            }
  
            function faliureGetData(message){
                toaster.pop("error", "Error", message);
            }

            function addCategory() {
                vm.category = {};
                var obj = { 
                    "isNew": true
                }
                vm.categoryTableData.data.push(obj);
                vm.addButton = false;
            }
            

            function saveCategory() {
                var dataExist = false;
                for(var i = 0; i < vm.categoryTableData.data.length; i++) {
                    if(vm.categoryTableData.data[i].name === vm.category.name && vm.categoryTableData.data[i].key != null){
                        dataExist = true;
                        break;
                    }
                }
                if(dataExist) {
                    toaster.pop("error", "Error", "Category alreadyexists");
                } else {
                    firebase.database().ref().child(categoryTableName).push({  
                        name : vm.category.name,
                        description : vm.category.description,
                        checked : false
                    });
                    toaster.pop("info", "Saved!!", "Category Added!!");
                    vm.addButton = true;
                    getCategories();
                }

            }

            function deleteRow(item) {
                firebaseService.deleteData(categoryTableName, item, function(message){
                    getCategories()
                    toaster.pop("error", "Delete", message);
                });
                // getCategories();
            }

            function editRow(item) {
                vm.category = item;   
                vm.category.isNew = true;
            };
        
            // function updateRow(item) {
            //     firebase.database().ref().child("category").child(item.key).update({
            //         name : vm.category.name,
            //         description : vm.category.description
            //     });
            //     toaster.pop("info", "Updated!!", "Category Updated!!");
            //     vm.category.isNew = false;
            // }
            function updateRow(item) {
                firebaseService.updateData(categoryTableName, item, function(message){;
                toaster.pop("info", "Updated!!", message);
                vm.category.isNew = false;
                })
            }
            
            function cancelNewRow(index) {
                vm.addButton = true;
                _.forEach(vm.categoryTableData.data, function(value){
                    value.isNew = false;
                })
                vm.categoryTableData.data.splice( index, 1 );
                vm.category = {};
            }

            function cancelUpdate(item) {
                vm.category = {};
                item.isNew = false;
            }

            // ----------Sub-Category ------------------- 

            function setSubCategory() {
                vm.categoryName = checkedItemData.name;
                vm.showSubCategory = checkedItemData.checked;
                
                getSubCategories();
                vm.addSubButton = true;
            }

            function removeSubCategory() {
                vm.categoryName = "";
                vm.subCategoryTableData.data =[];
            }

            function getSubCategories() {
                var categoryKey = checkedItemData.key;
                vm.subCategoryTableData.data =[];
                var subCategoryList = firebase.database().ref().child("subCategory").orderByChild("categoryKey").equalTo(categoryKey);
                // var subCategoryList = firebase.database().ref().child(categoryTableName).child(categoryKey).child(subCategoryTableName);
                subCategoryList.on('value', snapshot => {
                    if(snapshot.exists()) {
                        timeout(function() {
                            vm.subCategoryTableData.data = _.map(snapshot.val(), function(obj, key){
                                obj.key = key
                                return obj 
                            })
                        },10)
                    }
                });
            }

            function addSubCategory() {
                vm.subCategory = {};
                var obj = { 
                    "subNew": true
                }
                vm.subCategoryTableData.data.push(obj);
                vm.addSubButton = false;
            }

            function saveSubCategory() {
                var categoryKey = checkedItemData.key;
                var dataExist = false;
                for(var i = 0; i < vm.subCategoryTableData.data.length; i++) {
                    if(vm.subCategoryTableData.data[i].name === vm.subCategory.name && vm.subCategoryTableData.data[i].key != null){
                        dataExist = true;
                        break;
                    }
                }
                if(dataExist) {
                    toaster.pop("error", "Error", "Subcategory alreadyexists");
                } else {
                    var categoryKey = checkedItemData.key;
                    // firebase.database().ref().child(categoryTableName).child(checkedItemData.key).child(subCategoryTableName).push({  
                        firebase.database().ref().child(subCategoryTableName).push({
                        name : vm.subCategory.name,
                        description : vm.subCategory.description,
                        categoryKey : categoryKey
                    });
                    toaster.pop("info", "Saved!!", "subCategory Added!!");
                    vm.addSubButton = true;
                }

            }

            function subDeleteRow(item) {
                firebase.database().ref().child("subCategory").child(item.key).remove();
                toaster.pop("error", "Delete", "category Deleted");
            }

            // function subDeleteRow(item) {
            //     firebaseService.deleteData(subCategoryTableName, item, function(message){
            //         successGetData(message)
            //         toaster.pop("error", "Delete", message);
            //     });
            //     getCategories();
            // }

            function subEditRow(item) {
                vm.subCategory = item;   
                vm.subCategory.subNew = true;
            };

            function subUpdateRow(item) {
                firebase.database().ref().child("subCategory").child(item.key).update({
                    name : vm.subCategory.name,
                    description : vm.subCategory.description
                });
                toaster.pop("info", "Updated!!", "Category Updated!!");
                vm.subCategory = {};
            }

            function subCancelUpdate(item) {
                vm.subCategory = {};
                item.subNew = false;
            }

            function subCancelNewRow(index) {
                vm.addSubButton = true;
                _.forEach(vm.subCategoryTableData.data, function(value){
                    value.subNew = false;
                })
                vm.subCategoryTableData.data.splice( index, 1 );
                vm.subCategory = {};
            }


        }

        

})();