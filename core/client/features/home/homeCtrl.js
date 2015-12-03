angular.module("skyNautilus")

  .controller("homeCtrl", function ($scope, flightSearchService, $state) {
	
    //Toggle oneway or roundtrip search option display
    $scope.tripType = "roundtrip";

    $scope.isShown = function (tripType) {
      return tripType === $scope.tripType;
    };
  
////////////Request bodies////////////////////////////////////////
	
  
    //One Way/////////////////////////////
    $scope.populateSearch = function () {

      $scope.passengerCount = Number($scope.passengerCount);

      $scope.onewayRequestBody = {
        request: {
          passengers: {
            kind: "qpxexpress#passengerCounts",
            adultCount: $scope.passengerCount,
            childCount: 0,
            infantInLapCount: 0,
            infantInSeatCount: 0,
            seniorCount: 0
          },
          slice: [
            {
              kind: "qpxexpress#sliceInput",
              origin: "PDX",
              destination: $scope.destination,
              date: $scope.departureDate,
              maxStops: 10,
              maxConnectionDuration: 1440,
              preferredCabin: "",
              permittedDepartureTime: {
                kind: "qpxexpress#timeOfDayRange",
                earliestTime: "",
                latestTime: ""
              },
              permittedCarrier: [""],
              alliance: "",
              prohibitedCarrier: [""]
            }
          ],
          maxPrice: "",
          saleCountry: "",
          refundable: "",
          solutions: 50
        }
      };
	
  
      //Round Trip////////////////////////////////////////////
      $scope.roundtripRequestBody = {
        request: {
          passengers: {
            kind: "qpxexpress#passengerCounts",
            adultCount: $scope.passengerCount,
            childCount: 0,
            infantInLapCount: 0,
            infantInSeatCount: 0,
            seniorCount: 0
          },
           slice: [
            {
              kind: "qpxexpress#sliceInput",
              origin: "PDX",
              destination: $scope.destination,
              date: $scope.departureDate,
              maxStops: 10,
              maxConnectionDuration: 1440,
              preferredCabin: "",
              permittedDepartureTime: {
                kind: "qpxexpress#timeOfDayRange",
                earliestTime: "",
                latestTime: ""
              },
              permittedCarrier: [""],
              alliance: "",
              prohibitedCarrier: [""]
            },
             {
              kind: "qpxexpress#sliceInput",
              origin: $scope.destination,
              destination: "PDX",
              date: $scope.returnDate,
              maxStops: 10,
              maxConnectionDuration: 1440,
              preferredCabin: "",
              permittedDepartureTime: {
                kind: "qpxexpress#timeOfDayRange",
                earliestTime: "",
                latestTime: ""
              },
              permittedCarrier: [""],
              alliance: "",
              prohibitedCarrier: [""]
            }
          ],
          maxPrice: "",
          saleCountry: "",
          refundable: "",
          solutions: 50
        }
      };
    };   
    
    
    //Search function///////////////////////////////////////////////////////////
    $scope.getSearchResults = function () {
      if ($scope.tripType === "oneway") {
        JSON.stringify($scope.onewayRequestBody);
        flightSearchService.saveSearchData($scope.onewayRequestBody);
        flightSearchService.setTripType($scope.tripType);
        } else {
        JSON.stringify($scope.roundtripRequestBody);
        flightSearchService.saveSearchData($scope.roundtripRequestBody);
        flightSearchService.setTripType($scope.tripType);
      }
    };
    
    //Change to search results view///
    $scope.goToSearchResults = function () {
      $state.go("searchresults", {});
      console.log("Changing states");
    };
    
   //Variables///////////////////////     
   $scope.searchResults = flightSearchService.searchResults;
   $scope.airlines = flightSearchService.airlines;
   $scope.cities = flightSearchService.cities;     
  

});



 