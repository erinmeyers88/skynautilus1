angular.module("skyNautilus")
	.service("flightSearchService", function ($http, $q, $state) {
		
		//Saves search body to service
		var userInput = {};
		this.saveUserInput = function (input) {
			userInput = input;
		};


		//Gets search body from service
		this.getUserInput = function () {
			return userInput;
		};
		
	
		
		
		//This variable will hold everything that we want to get back from the http request
		var searchResultsObjectRaw = {
			tripType: userInput.tripType,
			cities: [],
			airlines: [],
			flightListings: []
		};



		function buildCleanSearchResults() {
			
			//Build clean search results object:
	
			var searchResultsObjectClean = {
				tripType: userInput.tripType,
				cities: [],
				airlines: [],
				flightListings: []
			};
		
			//Makes clean flight listings array///////////
			
			
			
			searchResultsObjectRaw.flightLisitings.forEach(function (listing) {
				delete listing.$$hashKey;
				delete listing.id;
				delete listing.kind;
				delete listing.pricing;
				listing.slice.forEach(function (item) {
					delete item.kind;
					delete item.duration;
					item.segment.forEach(function (item2) {
						delete item2.$$hashKey;
						delete item2.bookingCode;
						delete item2.bookingCodeCount;
						delete item2.cabin;
						delete item2.connectionDuration;
						delete item2.duration;
						delete item2.id;
						delete item2.kind;
						delete item2.marriedSegmentGroup;
						item2.leg.forEach(function (item3) {
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
						});
					});
				});
			});

			searchResultsObjectClean.flightListings = searchResultsObjectRaw.flightLisitings;
		
			//Makes clean cities array
			searchResultsObjectRaw.cities.forEach(function (array) {
				array.forEach(function (city) {
					searchResultsObjectClean.cities.push(city);
				});

			});
		
			//Makes clean airlines array
			searchResultsObjectRaw.airlines.forEach(function (array) {
				array.forEach(function (airline) {
					searchResultsObjectClean.airlines.push(airline);
				});
			});
		
		
		
			///////////////////////////////////////////////////////////////////////
			//This is the clean search results saved on the service////////////////
			var searchResultsFinal = searchResultsObjectClean;
			console.log("Final Search results", searchResultsFinal);
			return searchResultsFinal;
			//////////////////////////////////////////////////////////////////////
		
		
		};

		



		this.getSearchResultsFinal = function () {
			buildCleanSearchResults();
		};
		
		
		
		//////HTTP POST request for flight info//////////////////////////////////
		
			
		//API KEYS///////////////////////////////////////////////////////////	
		//other key: AIzaSyAFSQP3ClWoPPShBYApLfxjazl-1WsKpu8
		//win key: AIzaSyCL0ZLFUF5_SsrocXX6ZKSaRlonngvd9cE
		//my key: AIzaSyAFEjs778GYWjvMrYyuzPLk5eLAqtqLfdA
		//daniel law key: AIzaSyAfUeKttBcaUk-jAIpc9jMURjQ8V0FCBEs
		
		
		var submitGoogleSearch = function (searchBody) {

			return $http({
				method: 'POST',
				url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCL0ZLFUF5_SsrocXX6ZKSaRlonngvd9cE',
				data: searchBody
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
				searchResultsObjectRaw.cities.push(cities);
				searchResultsObjectRaw.airlines.push(airlines);
				searchResultsObjectRaw.flightListings.push(searchResults);
			});
		};
		
		
		///Search function///////////////////////////////////////////////////////////////////////////////////////
		
		this.search = function () {

			//Provides list of origins
		
			var origins = ["PDX", "LAX", "SFO"];

			////////////Request bodies////////////////////////////////////////
			
			//One Way//////////////////////////////////////////////
			var onewayRequestBody = {
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
							// origin: "",
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
	
  
			//Round Trip////////////////////////////////////////////
			var roundtripRequestBody = {
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
							// origin: "",
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
						},
						{
							kind: "qpxexpress#sliceInput",
							origin: userInput.destination,
							// destination: "",
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
					],
					maxPrice: "",
					saleCountry: "",
					refundable: "",
					solutions: 50
				}
			};



			//Search function/////////////////////////////////////////////////////
			if (userInput.tripType === "oneway") {
				origins.forEach(function (origin) {
					onewayRequestBody.request.slice[0].origin = origin;
					JSON.stringify(onewayRequestBody);
					submitGoogleSearch(onewayRequestBody);
				});
			} else {
				origins.forEach(function (origin) {
					roundtripRequestBody.request.slice[0].origin = origin;
					roundtripRequestBody.request.slice[1].destination = origin;
					JSON.stringify(roundtripRequestBody);
					submitGoogleSearch(roundtripRequestBody);
				});
			};

		};

		///////////////////////////
	});