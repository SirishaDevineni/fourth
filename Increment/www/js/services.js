angular.module('Calorie Counter.services', [])


.service('LoginService', function($q, $http) {
    return {
  loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
             $http({
        method: 'GET',
        url: 'https://api.mongolab.com/api/1/databases/diet_planner/collections/users?q={username:\''+name+'\'}&apiKey=ZJrN-tbYIcZW0_ASgss1ZjufJ-Y4Zd6V',
        contentType:"application/json"
        
    }).success(function(data){
     alert(data[0]._id.$oid);
      if (name == data[0].username && pw == data[0].password) {
                deferred.resolve('Welcome ' + data[0].username + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
                 
    })
    promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
  }
            
        }})
.service('DeleteService', function($q, $http) {
    return {
        
         deleteUser:function(name) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
             $http({
        method: 'GET',
        url: 'https://api.mongolab.com/api/1/databases/diet_planner/collections/users?q={username:\''+name+'\'}&apiKey=ZJrN-tbYIcZW0_ASgss1ZjufJ-Y4Zd6V',
        contentType:"application/json"
        
    }).success(function(data){
     alert(data[0]._id.$oid);
      if (name == data[0].username && pw == data[0].password) {
         
          $http({
              method: 'DELETE' ,   
        url: 'https://api.mongolab.com/api/1/databases/diet_planner/collections/users/'+data[0]._id.$oid+'?apiKey=ZJrN-tbYIcZW0_ASgss1ZjufJ-Y4Zd6V',
		 
             }).success(function (data) { 
             alert(1);
             })
                deferred.resolve('Welcome ' + data[0].username + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
                 
    })
    promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;

        }
        
    }
         })


  .service('UpdateService', function($q, $http) {
    return {
        
         updateUser:function(username) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
             $http({
        method: 'GET',
        url: 'https://api.mongolab.com/api/1/databases/diet_planner/collections/users?q={username:\''+username+'\'}&apiKey=ZJrN-tbYIcZW0_ASgss1ZjufJ-Y4Zd6V',
        contentType:"application/json"
        
    }).success(function(data){
     //alert(data[0]._id.$oid);
      if (name == data[0].username ) {
         
          $http({
              method: 'PUT' ,   
        url: 'https://api.mongolab.com/api/1/databases/diet_planner/collections/users/'+data[0]._id.$oid+'?apiKey=ZJrN-tbYIcZW0_ASgss1ZjufJ-Y4Zd6V',
		 data: JSON.stringify( { "$set" : { "password" : password } } ),
		 
		  contentType: "application/json"
             }).success(function (data) { 
             alert(1);
             })
                deferred.resolve('Welcome ' + data[0].username + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
                 
    })
    promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;

        }
        
    }
         })

.service('RegisterService', function($q, $http) {
    return {
        RegisterUser: function(fname, lname, address, age, email, username, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
          $http({
        method: 'POST',
        url: 'https://api.mongolab.com/api/1/databases/diet_planner/collections//users?apiKey=ZJrN-tbYIcZW0_ASgss1ZjufJ-Y4Zd6V',
        data: JSON.stringify({
       firstname: fname,
        lastname: lname,
        address: address,
        age: age,
        email: email,
        username: username,
        password: password,
    }),
        contentType:"application/json"
        
    }).success(function(data){
            
             alert(data);
              deferred.resolve('Welcome!');
            /* if ( data[0].username != null && data[0].password != null && data[0].lastname != null && data[0].firstname != null &&data[0].email != null ) {
                deferred.resolve('Welcome ' + data[0].username + '!');
            } else {
                deferred.reject('please fill all the fields');
            }
              */ 
    
    })
           promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
           
        }
    }
})

.factory('$localstorage', ['$window', function($window) {
	return {
			
		// save a single string to local storage
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
			
		// loading a single string from local storage
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
			
		// saving an object to local storage
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
			
		// loading an object from local storage
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || null);
		}
	}
}]);