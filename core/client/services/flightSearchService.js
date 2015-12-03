angular.module("skyNautilus")
	.service("flightSearchService", function ($http, $q) {
		
		
		//Gets trip type from homeCtrl
		
		var tripType = "";
		
		
		this.setTripType = function (data) {
			tripType = data;	
		};
		
		this.getTripType = function () {
			return tripType;
		};
		
		//Save search data to service so that I can repopulate search form to modify search in searchResultsCtrl	
		var userSearch = {};

		this.saveSearchData = function (data) {
			userSearch = data;
		};


		//Gets search data to use to repopulate search form in modify search results in searchResultsCtrl
		this.getSearchData = function () {
			return userSearch;
		};
		
		
		
		//API KEYS///////////////////////////////////////////////////////////	
		//other key: AIzaSyAFSQP3ClWoPPShBYApLfxjazl-1WsKpu8
		//win key: AIzaSyCL0ZLFUF5_SsrocXX6ZKSaRlonngvd9cE
		//my key: AIzaSyAFEjs778GYWjvMrYyuzPLk5eLAqtqLfdA
		//daniel law key: AIzaSyAfUeKttBcaUk-jAIpc9jMURjQ8V0FCBEs
		
		
		
		//This variable will hold everything that we want to get back from the http request
		var state = {};
		
		
		
		//HTTP POST request for flight info//////////////////////////////////
		
		this.search = function () {

			return $http({
				method: 'POST',
				url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAFSQP3ClWoPPShBYApLfxjazl-1WsKpu8',
				data: userSearch
			}).then(function (response) {

				var searchResults = response.data.trips;

				
				
				//Creates list of airlines for filter//////////////////////////////////////
				var airlineCodes = {
					AS: "Alaska",
					US: "US Air",
					VX: "Virgin America",
					B6: "Jet Blue",
					UA: "United",
					WS: "WestJet",
					NK: "Spirit",
					F9: "Frontier"
				};

				var airlines = [];

				searchResults.data.carrier.forEach(function (airline) {
					airline.code = airline.code.replace(/AS|US|VX|B6|UA|WS|NK|F9/gi, function (code) {
						return airlineCodes[code];
					});
					airlines.push(airline.code);
				});
			
			
				//Creates list of origin cities for filter//////////////////////////////////////
				var cities = [];

				searchResults.data.city.forEach(function (city) {
					cities.push(city.code);
				});
			
			
				//Maniuplates search results for display purposes////////////////////////////////////
				searchResults.tripOption.forEach(function (option1) {
					option1.saleTotal = option1.saleTotal.replace("USD", "$");
					option1.slice.forEach(function (option2) {
						option2.segment.forEach(function (option3) {
							var m = option3.duration % 60;
							var h = (option3.duration - m) / 60;
							option3.cleanDuration = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
							option3.flight.carrier = option3.flight.carrier.replace(/AS|US|VX|B6|UA|WS|NK|F9/gi, function (code) {
								return airlineCodes[code];
							});
							// option3.flight.number,
							option3.leg.forEach(function (option4) {
								option4.cleanDepartureTime = new Date(option4.departureTime);
								// option4.origin,
								option4.cleanArrivalTime = new Date(option4.arrivalTime);
								// option4.destination,
								var min = option4.duration % 60;
								var hour = (option4.duration - min) / 60;
								option4.cleanDuration = hour.toString() + ":" + (min < 10 ? "0" : "") + min.toString();
							});
						});
					});
				});
				return state.searchData = {
					cities: cities,
					airlines: airlines,
					searchResults: searchResults
				};
				
			
			});
		};


		// //This allows us to get the massaged results from the http request
		// this.getResults = function () {
		// 	return state.searchData;
		// };




	});