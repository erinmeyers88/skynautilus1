angular.module("skyNautilus").controller("homeCtrl", HomeController);

function HomeController ($scope, flightSearchService, $state) {
	
    $scope.userInput = {};
  
    //Toggles oneway or roundtrip search option display
    $scope.userInput.tripType = "roundtrip";

    $scope.showReturnDate = function () {
      return $scope.userInput.tripType === 'roundtrip';
    };
    
    //Search
    $scope.search = function () {
      flightSearchService.search($scope.userInput);
      // $scope.goToSearchResults();
    };
    
    //Change to search results view///
		$scope.goToSearchResults = function () {
			$state.go("searchresults");
			console.log("Changing states");
		};
  }