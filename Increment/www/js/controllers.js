angular.module('Calorie Counter.controllers', ['Calorie Counter.services'])

// controller for Home Page
.controller('HomeCtrl', function($scope, $localstorage, $http) {
    $scope.nutritions = [];
    
     $http.get("https://api.nutritionix.com/v1_1/search/+$scope.name+?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=9f67cc05&appKey=f45710255beca407d18d3fa29096106b")
     .then(function(result) {
        $scope.nutritions = result.data.hits;
        console.log($scope.nutritions);
    }, function(cause) {
        console.log(cause);
    })
    
     $scope.show_nutrition_info = function(item_id) {
         console.log(item_id);
     }
	// /.'
	// default values for user
	$scope.user = {
		name: "Default User",
		gender: "Default",
		weightKG: 0,
		heightCM: 0,
		ageInYears: 0,
		BMR: 0,
		activityLevel: 0,
		dailyCals: 0,
		calsConsumed: 0
	};
	
	// functions to be fired when the view is the active view
	$scope.$on("$ionicView.afterEnter", function(){
  
		// load user details if they are there
		if($localstorage.getObject('user') != null){
			$scope.user = $localstorage.getObject('user');
		}
		else{ // otherwise save defaults
			
			// save default values
			$localstorage.setObject('user', $scope.user);
		} // if
	});
	
}) // HomeCtrl

// controller for the calories page
.controller('CalorieCtrl', function($scope, $localstorage, $state, $ionicHistory, $ionicPopup) {
	// variables
	// array of food objects 
	$scope.foodItems;
	
	// functions to be fired when the view is the active view
	$scope.$on("$ionicView.beforeEnter", function(){
  
		// load user details if they are there
		if($localstorage.getObject('user') != null){
			$scope.user = $localstorage.getObject('user');
		}
		else{ // otherwise save defaults
			// save default values
			$localstorage.setObject('user', $scope.user);
		} // if
		
		// load food Items
		if($localstorage.getObject('foodItems') != null){
			$scope.foodItems = $localstorage.getObject('foodItems');
		}
		else{ // otherwise save defaults
			// save default values
			$localstorage.setObject('foodItems', $scope.foodItems);
		} // if
		
	});
	
	// function for adding a new food Item
	$scope.addNewFoodItem = function(i, food, cals){
		
		// add calories to calsConsumed
		$scope.user.calsConsumed += cals;
		
		$scope.foodItems.push({icon: i, name: food, calories: cals});
	} // addNewFoodItem()
	
	// function for saving and exiting from the calorie page
	$scope.saveAndExit = function(){
		// save user details and food Items
		$localstorage.setObject('foodItems', $scope.foodItems);	
		$localstorage.setObject('user', $scope.user);
		// disable back button when you move 
		// back to the home page
		$ionicHistory.nextViewOptions({
    		disableBack: true
  		});
		// go to home page
		$state.go('app.home');
	} // saveAndExit()
	
	// confirm delete all food items
 	$scope.showConfirm = function() {
   	var confirmPopup = $ionicPopup.confirm({
     		title: 'Delete All Food Items',
     		template: 'Are you sure you want to delete all food items?'
   	}); // confirmPopup()
   	confirmPopup.then(function(res) {
     		if(res) { // if yes
				// get info
				$scope.foodItems = $localstorage.getObject('foodItems');
				$scope.user = $localstorage.getObject('user');
				
				// emplty food items array and 
				// reset cals consumed
				$scope.foodItems = [];
				$scope.user.calsConsumed = 0;
				
				// save changes
				$localstorage.setObject('foodItems', $scope.foodItems);
				$localstorage.setObject('user', $scope.user);
     		} else { // if no
				// dont delete information
     		} // if
   	}); // confirmPopup.then()
 	}; // showConfirm()
		
}) // CalorieCtrl

.controller('RegisterCtrl', function($scope, RegisterService, DeleteService, UpdateService, $ionicPopup, $state) {
     $scope.data = {};
 
 $scope.delete =function(username)
		{
		
			
         DeleteService.deleteUser($scope.data.username).success(function(data) {
         var alertPopup = $ionicPopup.alert({
                title: 'Deleted!',
                template: 'Your account is deleted succesfully!'
            });
		}).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
		}
		 $scope.update =function(username)
		{
         UpdateService.updateUser($scope.data.username).success(function(data) {
         var alertPopup = $ionicPopup.alert({
                title: 'Updated!',
                template: 'Your account is updated succesfully!'
            });
		}).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Update failed!',
                template: 'Please check your credentials!'
            });
        });
		}   

   $scope.register = function(email){
      
            RegisterService.RegisterUser($scope.data.firstname, $scope.data.lastname, $scope.data.address, $scope.data.age, $scope.data.email, $scope.data.username, $scope.data.password ).success(function(data) {
           alert($scope.data.lastname);
                $state.go('app.login');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Registration failed!',
                template: 'Please check your credentials!'
            });
        });
    }
	
	    
	
})
.controller('LoginCtrl', function($scope, LoginService, DeleteService, UpdateService, $ionicPopup, $state) {
    $scope.data = {};
 

 
    $scope.login = function(username) {
         LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            alert("success");
			$state.go('app.home');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
           
    }
	
	
    $scope.signup =function()
    {
        $state.go('register');
    }
	
	
 
}
)

// controller for updating user settings
.controller('UpdateCtrl', function($scope, $localstorage, $state) {
	// variables
	// values for activity levels options
	$scope.activityLevels = {
		option1: "Don't exercise or exercise little.",
		option2: "Light exercise or sports 1 - 3 days a week.",
		option3: "Exercise moderately and/or play sports 3 - 5 days a week.",
		option4: "Strenuous sports or hard exercise 6 - 7 days a week.",
		option5: "Very physically challenging jobs or exercise, eg 2 workouts a day."
	};
	
	// users text discription for activity level
	$scope.userActivityLevel = "Select An Activity Level";
	
	// functions to be fired when the view is entered
	$scope.$on("$ionicView.beforeEnter", function(){
  
		// load user details
		$scope.user = $localstorage.getObject('user');
		
		// map activity level to text discription
		if($scope.user.activityLevel == 1.2){
			$scope.userActivityLevel = $scope.activityLevels.option1;	
		} else if($scope.user.activityLevel == 1.375){
			$scope.userActivityLevel = $scope.activityLevels.option2;
		} else if($scope.user.activityLevel == 1.55){
			$scope.userActivityLevel = $scope.activityLevels.option3;
		}else if($scope.user.activityLevel == 1.725){
			$scope.userActivityLevel = $scope.activityLevels.option4;
		}else if($scope.user.activityLevel == 1.9){
			$scope.userActivityLevel = $scope.activityLevels.option5;
		} // if else
	});
	
	// function to update user's name
	$scope.updateDetails = function(){  
		// calculate personal basal metabolic rate / BMR
		// for women
		if($scope.user.gender == "Female"){
			$scope.user.BMR = ((9.6 * $scope.user.weightKG) +
				(1.8 * $scope.user.heightCM) -
				(4.7 * $scope.user.ageInYears) + 655);
		} // if
		
		// for men
		if($scope.user.gender == "Male"){
			$scope.user.BMR = ((13.7 * $scope.user.weightKG) +
				(5 * $scope.user.heightCM) -
				(6.8 * $scope.user.ageInYears) + 66);
		} // if
		
		// calculate daily calorie needs based on 
		// user BMR and activity level
		$scope.user.dailyCals = Math.round($scope.user.BMR * $scope.user.activityLevel);
		
	  	// save users deatails
	  	$localstorage.setObject('user', $scope.user);
	}; // updateDetails()
	
	$scope.goToActivityLevel = function(){
		// save users deatails
	  	$localstorage.setObject('user', $scope.user);
		
  		$state.go('app.activityLevel');
	} // goToActivityLevel()
	
}) // UpdateCtrl

// controller for Activity Level page
.controller('ActivityCtrl', function($scope, $localstorage, $ionicHistory) {
	// variables
	// values for activity levels options
	$scope.activityLevels = {
		option1: "Don't exercise or exercise little.",
		option2: "Light exercise or sports 1 - 3 days a week.",
		option3: "Exercise moderately and/or play sports 3 - 5 days a week.",
		option4: "Strenuous sports or hard exercise 6 - 7 days a week.",
		option5: "Very physically challenging jobs or exercise, eg 2 workouts a day."
	};
	
	// functions to be fired when the view is entered
	$scope.$on("$ionicView.enter", function(){
 
		// load user details
		$scope.user = $localstorage.getObject('user');
	});
	
	// to go back to last view from select activity page
	$scope.goBack = function(){
		// save users deatails
	  	$localstorage.setObject('user', $scope.user);
		
  		$ionicHistory.goBack();
	} // goBack()
   
}) // ActivityCtrl

// controller for settings page
.controller('SettingsCtrl', function($scope, $localstorage, $ionicPopup) {
	// variables
	// values for activity levels options
	$scope.activityLevels = {
		option1: "Don't exercise or exercise little.",
		option2: "Light exercise or sports 1 - 3 days a week.",
		option3: "Exercise moderately and/or play sports 3 - 5 days a week.",
		option4: "Strenuous sports or hard exercise 6 - 7 days a week.",
		option5: "Very physically challenging jobs or exercise, eg 2 workouts a day."
	};
	
	// users text discription for activity level
	$scope.userActivityLevel = "Select An Activity Level";
	
	// functions to be fired when the view is entered
	$scope.$on("$ionicView.enter", function(){
 
		// load user details
		$scope.user = $localstorage.getObject('user');
		
		// map activity level to text discription
		if($scope.user.activityLevel == 1.2){
			$scope.userActivityLevel = $scope.activityLevels.option1;	
		} else if($scope.user.activityLevel == 1.375){
			$scope.userActivityLevel = $scope.activityLevels.option2;
		} else if($scope.user.activityLevel == 1.55){
			$scope.userActivityLevel = $scope.activityLevels.option3;
		}else if($scope.user.activityLevel == 1.725){
			$scope.userActivityLevel = $scope.activityLevels.option4;
		}else if($scope.user.activityLevel == 1.9){
			$scope.userActivityLevel = $scope.activityLevels.option5;
		} // if else
	});
	
	// confirm delete all user info
 	$scope.showConfirm = function() {
   	var confirmPopup = $ionicPopup.confirm({
     		title: 'Delete All User Information',
     		template: 'Are you sure you want to delete all user information?'
   	}); // confirmPopup()
   	confirmPopup.then(function(res) {
     		if(res) { // if yes
				// delete all user information
       		$scope.user = {
					name: "Default User",
					gender: "Default",
					weightKG: 0,
					heightCM: 0,
					ageInYears: 0,
					BMR: 0,
					activityLevel: 0,
					dailyCals: 0,
					calsConsumed: 0	
				};
				$scope.userActivityLevel = "Select An Activity Level";
				// empty foodItems array
				$scope.foodItems = $localstorage.getObject('foodItems');
				$scope.foodItems = [];
				$localstorage.setObject('foodItems', $scope.foodItems);
				// save changes
				$localstorage.setObject('user', $scope.user);
     		} else { // if no
				// dont delete information
     		} // if
   	}); // confirmPopup.then()
 	}; // showConfirm()
   
}) // SettingsCtrl

  .controller('NutritionControl', function($scope, $http){
    var pendingTask;

    $scope.nutrition_fact = {
        calories: 123,
        calories_from_fat:12,
        total_fat:0,
        saturated_fat:0,
        cholesterol:0,
        sodium:0,
        total_carbohydrate:0,
        dietary_fiber:0,
        sugars:0,
        protein:0
                        
        
    };
    
    if($scope.search === undefined){
      $scope.search = "tacos";
      fetch($scope.search);
    }

    $scope.change = function(search){
      if(pendingTask){
        clearTimeout(pendingTask);
      }
      pendingTask = setTimeout(fetch, 800, search);
    };
    
    function fetch(search){
      $http.get("https://api.nutritionix.com/v1_1/search/"+ search + "?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=9f67cc05&appKey=f45710255beca407d18d3fa29096106b")
     .then(function(result) {
        $scope.nutritions = result.data.hits;   
        console.log($scope.nutritions);
    }, function(cause) {
        console.log(cause);
    })
    
     $scope.show_nutrition_info = function(item_id) {
         $http.get( "https://api.nutritionix.com/v1_1/item?id="+item_id+"&appId=83d5566b&appKey=05ac48fe988747ba61260170985c8a26")
              .then(function(result) {
                    $scope.nutrition_fact.calories = result.data.nf_calories;
                    $scope.nutrition_fact.calories_from_fat = result.data.nf_calories_from_fat;
                    $scope.nutrition_fact.total_fat = result.data.nf_total_fat;
                    $scope.nutrition_fact.saturated_fat = result.data.nf_saturated_fat;
                    $scope.nutrition_fact.cholesterol = result.data.nf_cholesterol;
                    $scope.nutrition_fact.sodium = result.data.nf_sodium;
                    $scope.nutrition_fact.total_carbohydrate = result.data.nf_total_carbohydrate;
                    $scope.nutrition_fact.dietary_fiber = result.data.nf_dietary_fiber;
                    $scope.nutrition_fact.sugars = result.data. nf_sugars;
                     $scope.nutrition_fact.protein = result.data.nf_protein;
                    
                    
                },
                function(cause) {}
          )
     }

    $scope.update = function(movie){
      $scope.search = movie.Title;
      $scope.change();
    };

    $scope.select = function(){
      this.setSelectionRange(0, this.value.length);
    }
  }
    
  
})


 .controller('dietControl', function($scope, $http){
    var req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'https://api.edamam.com/api/nutrition-details?app_id=ff765e06&app_key=924ba3a51142bb56b6b34fca0065a82f',
        data: {
            title: 'chicken curry',
            ingr:'chicken'
       }
    }

$http(req).then(function(result) {console.log(result);}, function(cause) {console.log(cause);})

//    function fetch(search){
//      $http.get("https://api.edamam.com/api/nutrition-details?app_id=${ff765e06}&app_key=${924ba3a51142bb56b6b34fca0065a82f}")
//     .then(function(result) {
//          console.log(cause);
//        //$scope.diet = result.data.hits;   
//        //console.log($scope.nutritions);
//    } //function(cause) 
//          ) }
        
    })

