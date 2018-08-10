(function() {
    angular
        .module("adminCart")
            .factory("firebaseService", firebaseService)

    firebaseService.$inject = ["$q", "$rootScope"];
    function firebaseService($q, $rootScope) {
        return {
            signIn : signIn,
            logOut : logOut,
            getCurrentUser : getCurrentUser,
            getData : getData,
            deleteData : deleteData,
            updateData : updateData,
            getSubCategoryData : getSubCategoryData,
            getImageUrl : getImageUrl,
            deleteImage : deleteImage,

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

        function getSubCategoryData(categoryKey) {
            return $q(function(resolve, reject) {
                var subCategoryList = firebase.database().ref().child("subCategory").orderByChild("categoryKey").equalTo(categoryKey);
                subCategoryList.on('value', snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key){
                            obj.key = key
                            return obj 
                        })
                        resolve(data)
                    } else {
                        reject("something went wrong");
                    }
                });
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

        function getImageUrl(snapRef) {
            return snapRef.snapshot.ref.getDownloadURL();
        }

        function deleteImage(file) {
            var deleteRef = firebase.storage().ref().child("photos").child(file.name);
            return deleteRef.delete();
        }

        
        

    }
}) ();