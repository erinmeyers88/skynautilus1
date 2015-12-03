angular.module("skyNautilus")
  .controller("searchResultsCtrl", function ($scope, flightSearchService, loadResults) {
    
    $scope.getUserSearch = function () {
      $scope.userSearch = flightSearchService.saveSearchData();
    };
    
    $scope.getSearchData = function () {
      $scope.searchData = loadResults;
      $scope.searchResults = $scope.searchData.searchResults;
      $scope.cities = $scope.searchData.cities;
      $scope.airlines = $scope.searchData.airlines;
      
      $scope.tripType = flightSearchService.getTripType();
    }();
    
    console.log($scope.searchResults);

     $scope.isShown = function (tripType) {
      return tripType === $scope.tripType;
    };
    

  });
  
  