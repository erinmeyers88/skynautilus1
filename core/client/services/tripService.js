angular.module("skyNautilus")
	.service("tripService", function ($http) {
		
		
		//Add trip///////////
		this.addTrip = function (trip) {
			return $http ({
				method: "POST",
				url: "/api/trips",
				data: trip
			}).then(function (response) {
				return response.data;
			});
		};
		
		
	});