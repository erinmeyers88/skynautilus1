angular.module("skyNautilus")
  .controller("searchResultsCtrl", function ($scope, flightSearchService, tripService, loadResults) {
    
    //Loads the search results from the API call, sets trip type
    $scope.getsearchResults = function () {
      $scope.searchResults = loadResults;
    }();
    
    console.log($scope.searchResults);
    
    //Determines whether to show depart and return labels
    $scope.isShown = function (tripType) {
      return tripType === $scope.searchResults.tripType;
    };
    
    
    //Retreive user search to be able to repopulate the modify search form 
    $scope.getUserSearch = function () {
      $scope.userSearch = flightSearchService.getUserInput();
    };
    

    //Shows or hides save trip modal

    $scope.showHideModal = function () {
      var el = document.getElementById("overlay");
      el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    };


    //Shows or hides new trip input
    
    $scope.newTripInputShown = false;
    
    
    //Sets selected itinerary
    
    $scope.setSelectedItinerary = function (itinerary) {
      $scope.selectedItinerary = itinerary;
    };
    
    
    //Saves itinerary to database
    
    $scope.itineraryToSave = {};

    $scope.addTrip = function () {

      console.log($scope.selectedItinerary);

      $scope.itineraryToSave.name = $scope.tripName;

      // delete $scope.selectedItinerary.$$hashKey;
      // delete $scope.selectedItinerary.id;
      // delete $scope.selectedItinerary.kind;
      // delete $scope.selectedItinerary.pricing;
      // $scope.selectedItinerary.slice.forEach(function (item) {
      //   delete item.kind;
      //   delete item.duration;
      //   item.segment.forEach(function (item2) {
      //     delete item2.$$hashKey;
      //     delete item2.bookingCode;
      //     delete item2.bookingCodeCount;
      //     delete item2.cabin;
      //     delete item2.connectionDuration;
      //     delete item2.duration;
      //     delete item2.id;
      //     delete item2.kind;
      //     delete item2.marriedSegmentGroup;
      //     item2.leg.forEach(function (item3) {
      //       delete item3.$$hashKey;
      //       delete item3.aircraft;
      //       delete item3.arrivalTime;
      //       delete item3.departureTime;
      //       delete item3.destinationTerminal;
      //       delete item3.meal;
      //       delete item3.duration;
      //       delete item3.id;
      //       delete item3.kind;
      //       delete item3.mileage;
      //       delete item3.onTimePerformance;
      //       delete item3.secure;
      //     });
      //   });
      // });

      $scope.itineraryToSave.itineraries = [];
      $scope.itineraryToSave.itineraries.push($scope.selectedItinerary);

      console.log($scope.itineraryToSave);

      tripService.addTrip($scope.itineraryToSave).then(function (response) {
        return response;
      });
      
      $scope.showHideModal();
      
    };




  });
  
  