var mongoose = require("mongoose");

var TripModel = mongoose.Schema({
	
	name: {type: String, required: true},
	itineraries : [{
		
		saleTotal: {type: Number},
		slice: [{
			duration: {type: Number},
			segment: [{
				duration: {type: Number},
				flight: {
					carrier: {type: String},
					number: {type: Number}
				},
				leg: [{
					arrivalTime: {type: Date},
					departureTime: {type: Date,},
					destination: {type: String,},
					duration: {type: Number,},
					origin: {type: String,}	
				}]
			}]
		}]	
}],
	totalPrice: {type: Number}
	
});
	
	
module.exports = mongoose.model("trip", TripModel);



