var Ctrl = require("./user.server.controller");


module.exports = function (app) {

	app.route("/api/user")
		.post(Ctrl.addUser)
		.get(Ctrl.getUser);

};