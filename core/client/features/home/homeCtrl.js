angular.module("skyNautilus")

  .controller("homeCtrl", function ($scope, flightSearchService, $state) {
	
    //Toggles oneway or roundtrip search option display
    $scope.tripType = "roundtrip";

    $scope.isShown = function (tripType) {
      return tripType === $scope.tripType;
    };
  
    //Creates user input object
  
    $scope.createUserInputObject = function () {
      $scope.userInput = {
        tripType: $scope.tripType,
        passengerCount: Number($scope.passengerCount),
        destination: $scope.destination,
        departureDate: $scope.departureDate,
        returnDate: $scope.returnDate,
      };
    };
  
  
    //Saves user input object to service
    $scope.saveUserInputObject = function () {
      flightSearchService.saveUserInput($scope.userInput);
    };
    
    
    //Change to search results view///
		$scope.goToSearchResults = function () {
			$state.go("searchresults");
			console.log("Changing states");
		};

    //Search
    
    $scope.search = function () {
      $scope.createUserInputObject();
      $scope.saveUserInputObject();
      flightSearchService.search();
      $scope.goToSearchResults();
    };
    
   
    
  });



 