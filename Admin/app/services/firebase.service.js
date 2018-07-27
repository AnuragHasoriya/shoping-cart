(function() {
    angular
        .module("adminCart")
            .factory("firebaseService", firebaseService)

    firebaseService.$inject = ["$q"];
    function firebaseService($q) {
        return {
            signIn : signIn,
            logOut : logOut,
            getCurrentUser : getCurrentUser,
            getData : getData,
            deleteData : deleteData,
            updateData : updateData
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

        // function getData(tableName, callback) {
        //     return firebase.database().ref().child(tableName).on('value', function(snapshot) {
        //         callback(snapshot);
        //     })
        // }

        function getData(tableName) {
            return $q(function(resolve, reject){ 
                firebase.database().ref().child(tableName).on('value', function(snapshot) {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key){
                            obj.key = key
                            return obj 
                        })
                        resolve(data)
                    } else {
                        reject("no rows present");
                    }
                })
            })
        }

        function deleteData(tableName, rowKey, callback) {
            return $q(function(resolve, reject){ 
                var key = rowKey.key;
                data = firebase.database().ref().child("subCategory").orderByChild("categoryKey").equalTo(key);
                data.once("value", snapshot => {
                    snapshot.forEach(function(childsnapShot) {
                        firebase.database().ref().child("subCategory").child(childsnapShot.key).remove();
                    })  
                })
                firebase.database().ref().child(tableName).child(key).remove();
                return callback("Row deleted");
            })
        }

        function updateData(tableName, rowKey, callback) {
            var key = rowKey.key;
            firebase.database().ref().child(tableName).child(key).update({
                name : rowKey.name,
                description :rowKey.description  
            });
            return callback("Row updated");

        }
        

    }
}) ();