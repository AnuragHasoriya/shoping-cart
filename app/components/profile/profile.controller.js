(function() {
    angular
        .module("shoppingCart")
        .controller("profileController", profileController);

    profileController.$inject = ["$state", "$log", "$firebase", "toaster","firebaseService","$location"];

    function profileController($state, $log, $firebase, toaster, firebaseService, $location) {
       
        var vm = this;
        vm.profileForm = {};
        var user = firebase.auth().currentUser;
        if(user != null){
            emailVerified = user.emailVerified;
            uid = user.uid;
        }

        var url = $location.quer;
        vm.userProfile = function() {
                
                var url = $location.path();
               console.log(url);
            function writeUserData( firstname, lastname, email, dob, phoneno) {
                firebase.database().ref('user-profile/' + userId).set({
                  firstname : firstname,
                  lastname : lastname,
                  email : email,
                  dob : dob,
                  phone : phoneno
                });
            }
        }
    }
}) ();