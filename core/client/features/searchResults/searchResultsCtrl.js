angular.module("skyNautilus")
  .controller("searchResultsCtrl", function ($scope, flightSearchService, loadResults, tripService) {
    
    //Retreive user search to be able to repopulate the modify search form 
    $scope.getUserSearch = function () {
      $scope.userSearch = flightSearchService.saveSearchData();
    };
    
    
    
    //Loads the search results from the API call, sets trip type
    $scope.getSearchData = function () {
      $scope.searchData = loadResults;
      $scope.searchResults = $scope.searchData.searchResults;
      $scope.cities = $scope.searchData.cities;
      $scope.airlines = $scope.searchData.airlines;

      $scope.tripType = flightSearchService.getTripType();
    } ();


    //Determines whether to show depart and return labels
    $scope.isShown = function (tripType) {
      return tripType === $scope.tripType;
    };


    //Shows or hides save trip modal

    $scope.showHideModal = function () {
      var el = document.getElementById("overlay");
      el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    };

    //Saves itinerary to database
    
    $scope.addTrip = function () {
      tripService.addTrip($scope.selectedTrip).then(function (response) {
        return response;
      });
    };




  });
  
  