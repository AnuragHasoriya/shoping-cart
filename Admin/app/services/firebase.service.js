(function() {
    angular
        .module("adminCart")
            .factory("firebaseService", firebaseService)

    function firebaseService() {
        return {
            signIn : signIn,
            logOut : logOut
        }

        function signIn(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        } 
        
        function logOut() {
            return firebase.auth().signOut();
        }
    }
}) ();