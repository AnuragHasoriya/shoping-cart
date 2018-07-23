(function() {
    angular
        .module("adminCart")
            .factory("firebaseService", firebaseService)

    function firebaseService() {
        return {
            signIn : signIn,
            logOut : logOut,
            getCurrentUser : getCurrentUser
        }

        function signIn(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        } 
        
        function logOut() {
            return firebase.auth().signOut();
        }

        function getCurrentUser(){
            return firebase.auth().currentUser;
        }
    }
}) ();