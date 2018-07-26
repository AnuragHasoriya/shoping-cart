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

                vm.subCategoryTableData = {
                    data: [], 
                    // urlSync: true
                };
                getCategories();
                vm.addButton = true;
            }

            function updateSelection(object) {
                checkedItemData = object;
                _.forEach(vm.categoryTableData.data, function(data) {
                    data.checked =false;
                })
                object.checked =true;
                setSubCategory();
            }

            function getCategories() {
                var categoryList = firebase.database().ref().child("category");
                categoryList.on('value', snapshot => {
                    timeout(function () {
                        if(snapshot.exists()) {
                            vm.categoryTableData.data =_.map(snapshot.val(), function(obj, key){
                                obj.key = key
                                return obj 
                            })

                        } else {
                            toaster.pop("error", "Error", "No category exists");
                        }
                    },10);
                });
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
                    toaster.pop("error", "Error", "category alreadyexists");
                } else {
                    firebase.database().ref().child("category").push({  
                        name : vm.category.name,
                        description : vm.category.description,
                        checked : false
                    });
                    toaster.pop("info", "Saved!!", "Category Added!!");
                    vm.addButton = true;
                }
            }

            function deleteRow(item) {
                firebase.database().ref().child("category").child(item.key).remove();
                toaster.pop("error", "Delete", "category Deleted");
            }

            function editRow(item) {
                vm.category = item;   
                vm.category.isNew = true;
            };
        
            function updateRow(item) {
                firebase.database().ref().child("category").child(item.key).update({
                    name : vm.category.name,
                    description : vm.category.description
                });
                toaster.pop("info", "Updated!!", "Category Updated!!");
                vm.category = {};
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

            function getSubCategories() {
                var categoryKey = checkedItemData.key;
                vm.subCategoryTableData.data =[];
                //var subCategoryList = firebase.database().ref().child("subCategory").child('-LILmcuRxXFy9zNBOX1p');
                var subCategoryList = firebase.database().ref().child("subCategory").orderByChild("categoryKey").equalTo(categoryKey);
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
                    if(vm.subCategoryTableData.data[i].name === vm.subCategory.name && vm.subCategoryTableData.data[i].key!=null){
                        dataExist = true;
                        break;
                    }
                }
                if(dataExist) {
                    toaster.pop("error", "Error", "Subcategory alreadyexists");
                } else {
                    var categoryKey = checkedItemData.key;
                    firebase.database().ref().child("subCategory").push({  
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
                vm.category = {};
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