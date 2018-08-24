(function() {
    angular
        .module("adminCart")
            .factory("productService", productService)

        productService.$inject = ["$q", "$rootScope"];

    function productService($q, $rootScope) {
        return {
            getKeyName : getKeyName,
            getProductData : getProductData
        }

        function getKeyName(key, tableName, callBack) {
            var name;
            data = firebase.database().ref().child(tableName).child(key);
            data.once("value", snapshot => {
                if( tableName == "products") {
                    if(snapshot.exists()) {
                        var image = snapshot.val().image;
                        return callBack(image)
                    }

                } else {
                    if(snapshot.exists()) {
                        var name = snapshot.val().name;
                        return callBack(name)
                    } else {
                        return callBack("noName")
                    }
                }
            }) 
        }

        function getProductData(key, tableName) {
            return $q(function(resolve, reject) { 
                firebase.database().ref().child(tableName).child(key).on('value', function(snapshot) {
                    if(snapshot.exists()) {
                        var data = null;
                        if(tableName == "inventory") {
                            // data = _.map(snapshot.val(), function(obj, key) {
                            //     obj.key = key
                            //     return obj 
                            // });
                            data = snapshot.val();
                            data.key = key;
                        } else {
                            data = snapshot.val();
                        } 
                        resolve(data)
                    } else {
                        reject("no rows present");
                    }
                })
            })
        }
    }
})();