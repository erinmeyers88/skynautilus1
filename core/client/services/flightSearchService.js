angular.module("skyNautilus").service("flightSearchService", FlightSearchService);

function FlightSearchService($http, $state) {

	///Search function////////////////////////////////////////////////////		
	this.search = function (userInput) {

		var origins = ["PDX", "LAX", "SFO"],
			length = origins.length - 1,
			index = 0,
			searchResults = {
				tripType: userInput.tripType,
				cities: [],
				airlines: [],
				flightListings: []
			};
		
		find(index);
					
		function find (index) {
			
			var requestBody = JSON.stringify(buildRequestBody(origins[index], userInput));
			
			submitGoogleSearch(requestBody, userInput)
				.then(function (response) {
					addToResults(response);
					if (index < length) {
						index++
						find (index)							
					} else {
						return searchResults;
					} 
				},
				function (err) {
					console.log(err);
				});			
		}
		
		function addToResults (results) {			

			// cities //
			searchResults.cities.concat(results.header.city);
			
			//airlines//
			
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
			
			results.header.carrier.forEach(function (airline) {
				airline.code = airline.code.replace(/AS|US|VX|B6|UA|WS|NK|F9/gi, function (code) {
					return airlineCodes[code];
				});
			});
			
			searchResults.airlines.concat(results.header.carrier);
			

			
			//Itineraries//
			results.tripOptions.forEach(function (option1) {
				option1.saleTotal = option1.saleTotal.replace("USD", "$");
				delete listing.$$hashKey;
				delete listing.id;
				delete listing.kind;
				delete listing.pricing;
				option1.slice.forEach(function (option2) {
					delete item.kind;
					delete item.duration;
					option2.segment.forEach(function (option3) {
						delete item2.$$hashKey;
						delete item2.bookingCode;
						delete item2.bookingCodeCount;
						delete item2.cabin;
						delete item2.connectionDuration;
						delete item2.duration;
						delete item2.id;
						delete item2.kind;
						delete item2.marriedSegmentGroup;
						
						var m = option3.duration % 60;
						var h = (option3.duration - m) / 60;
						option3.cleanDuration = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
						option3.flight.carrier = option3.flight.carrier.replace(/AS|US|VX|B6|UA|WS|NK|F9/gi, function (code) {
							return airlineCodes[code];
						});
						option3.leg.forEach(function (option4) {
							delete item3.$$hashKey;
							delete item3.aircraft;
							delete item3.arrivalTime;
							delete item3.departureTime;
							delete item3.destinationTerminal;
							delete item3.meal;
							delete item3.duration;
							delete item3.id;
							delete item3.kind;
							delete item3.mileage;
							delete item3.onTimePerformance;
							delete item3.secure;
								
							option4.cleanDepartureTime = new Date(option4.departureTime);
							option4.cleanArrivalTime = new Date(option4.arrivalTime);
							var min = option4.duration % 60;
							var hour = (option4.duration - min) / 60;
							option4.cleanDuration = hour.toString() + ":" + (min < 10 ? "0" : "") + min.toString();
						});
					});
				});
			});
			
			searchResults.flightListings.concat(results.tripOptions);

	}				
	};	
	
	this.getSearchResultsFinal = function () {
		
	};
	
	
	
	
	
	// helper functions //
	
	
	//API KEYS///////////////////////////////////////////////////////////	
	//other key: AIzaSyAFSQP3ClWoPPShBYApLfxjazl-1WsKpu8
	//win key: AIzaSyCL0ZLFUF5_SsrocXX6ZKSaRlonngvd9cE
	//my key: AIzaSyAFEjs778GYWjvMrYyuzPLk5eLAqtqLfdA
	//daniel law key: AIzaSyAfUeKttBcaUk-jAIpc9jMURjQ8V0FCBEs
	
	
	//////HTTP POST request for flight info//////////////////////////////////
	function submitGoogleSearch (searchBody, userInput) {
		var endpoint = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAFEjs778GYWjvMrYyuzPLk5eLAqtqLfdA'
		return $http.post(endpoint, searchBody).then(function (response) {
			return { header: response.data.trips.data, tripOptions: response.data.trips.tripOption };			
		});
	}
	
	function buildRequestBody(origin, userInput) {
		userInput.passengerCount = +userInput.passengerCount;
		
		var requestBody = {
			request: {
				passengers: {
					kind: "qpxexpress#passengerCounts",
					adultCount: userInput.passengerCount,
					childCount: 0,
					infantInLapCount: 0,
					infantInSeatCount: 0,
					seniorCount: 0
				},
				slice: [
					{
						kind: "qpxexpress#sliceInput",
						origin: origin,
						destination: userInput.destination,
						date: userInput.departureDate,
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
	
	if (userInput.tripType === "roundtrip") {
		requestBody.request.slice.push(
			{
				kind: "qpxexpress#sliceInput",
				origin: userInput.destination,
				destination: origin,
				date: userInput.returnDate,
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
		);
	}
			
	return requestBody;
}

}