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
            getProductForInventory : getProductForInventory,
            getImageUrl : getImageUrl,
            deleteImage : deleteImage,
            getProductKey : getProductKey,
            getProdForInvent : getProdForInvent,
            updateInventoryStatus : updateInventoryStatus

        }


        function signIn(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        } 
        
        function logOut() {
            return firebase.auth().signOut();
        }

        function getCurrentUser() {
            return firebase.auth().currentUser;
        }

        function getData(tableName) {
            return $q(function(resolve, reject){ 
                firebase.database().ref().child(tableName).on('value', function(snapshot) {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key) {
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

        function getProductForInventory(tableName) {
            return $q(function(resolve, reject) {
                var productList = firebase.database().ref().child(tableName).orderByChild("inventorySet").equalTo(null);
                productList.on('value', snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key) {
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

        function getSubCategoryData(categoryKey) {
            return $q(function(resolve, reject) {
                var subCategoryList = firebase.database().ref().child("subCategory").orderByChild("categoryKey").equalTo(categoryKey);
                subCategoryList.on('value', snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key) {
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

        function getProductKey() {
            return $q(function(resolve, reject) {
                data = firebase.database().ref().child("inventory").orderByChild("productkey"); 
                data.once("value", snapshot => {
                    if(snapshot.exists()) {
                        var data = _.map(snapshot.val(), function(obj, key) {
                            obj.key = key
                            return obj 
                        })
                        resolve(data)
                    }
                    else {
                        reject();
                    }
                })
            })
        }

        function getProdForInvent(keyArrayObj) {
            key = keyArrayObj.productkey;
            totalStock = keyArrayObj.totalStock
            return $q(function(resolve, reject) {
                var pro = firebase.database().ref().child("products").child(key);
                pro.once("value", fetchData => {
                    if(fetchData.exists()) {
                        var data = fetchData.val();
                        data.key = keyArrayObj.productkey;
                        data.inventoryCount = keyArrayObj.totalStock;
                        resolve(data)
                    } else {
                        reject();
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

        function updateInventoryStatus(tableName, rowKey, callback) {
            firebase.database().ref().child(tableName).child(key).update({
                inventorySet : true
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