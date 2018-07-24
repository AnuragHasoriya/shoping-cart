(function() {
    angular
        .module("adminCart")
        .controller("categoryController", categoryController);

        categoryController.$inject = ["$scope", "$state", "firebaseService", "$timeout", "toaster"];

        function categoryController($scope, $state, firebaseService, timeout, toaster) {

            var vm = this;

            vm.category = {};
            var currentuser = firebaseService.getCurrentUser();

            vm.init = function(){
                vm.gridOptions = {
                    data: [], 
                    urlSync: true
                };
                getCategories();
            }

            function getCategories(){
                var categoryList = firebase.database().ref().child("category");
                categoryList.on('value', snapshot => {
                    timeout(function () {if(snapshot.exists()){
                        vm.gridOptions.data = _.filter(snapshot.val(), function(o) { return o; });;
                        _.forEach(vm.gridOptions.data, function(value){
                            value.isNew = false;
                        })
                        // $scope.$apply();
                    } else {
                        toaster.pop("error", "Error", "No category exists");
                    }
                    },10);
                });
            }
  
            vm.addRow = function() {
                var obj = { 
                    "isNew": true
                }
                vm.gridOptions.data.push(obj);
            }
            

            vm.saveRow = function() {
                firebase.database().ref().child("category").push({  
                // firebase.firestore().collection("category").add({
                    name : vm.category.name,
                    description : vm.category.description
                });
                //getCategories();
            }
        }
})();