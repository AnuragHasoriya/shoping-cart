(function() {
    angular
        .module("shoppingCart")
            .factory("firebaseService", firebaseService)

    function firebaseService() {
        return {
            signUp : signUp,
            signIn : signIn,
            logOut : logOut,
            emailVerify : emailVerify,
            getCurrentUser: getCurrentUser
            // tokenId : tokenId
        }

        function signUp(email, password) {
            return firebase.auth().createUserWithEmailAndPassword(email, password);
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

        function emailVerify(currentuser) {
            return  currentuser.sendEmailVerification();
        }

    

        // function tokenId() {
        //     return  firebase.auth().currentUser.getIdToken();
        // }

    }

    

})();

