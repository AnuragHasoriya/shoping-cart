(function() {
    angular
        .module("adminCart")
        .controller("categoryController", categoryController);

        categoryController.$inject = ["$state", "firebaseService", "$timeout", "toaster"];

        function categoryController($state, firebaseService, timeout, toaster) {

            var vm = this;
            vm.category = {};
            var currentuser = firebaseService.getCurrentUser();
            var categoryList = firebase.database().ref().child("category/" + currentuser);
            categoryList.on('value', function(snapshot) {
                if(snapshot.exists()){
                    vm.details = snapshot;
                } else {
                    toaster.pop("error", "Error", "No category exists");
                }
            });

            vm.categoryType = function() {
                firebase.database().ref().child("category").push({  
                // firebase.firestore().collection("category").add({
                    name : vm.category.name,
                    description : vm.category.description
                })

            }
        }
})();