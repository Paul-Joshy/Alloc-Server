const express = require('express');
const jwt = require('jsonwebtoken');
let router = express.Router();

/* all routes before authentication */
const loginRouter = require('./login.js');
/* all routes after authentication */
const sectionsRouter = require('./router-sections.js');
const prereqsRouter = require('./router-prereqs.js');
const combinationsRouter = require('./router-combinations.js');
const sessionsRouter = require('./router-sessions.js');
const combinationsToSessions = require('./router-combinations-to-sessions');

const authenticate = function(req, res, next) {
    // check query for token
	var token = req.cookies.token || req.headers.token;
    // decode token
	if (token) {
        // verifies secret and checks exp
		jwt.verify(token, "super-secret-key", function(err) {
			if (err) {
				let err = new Error("Failed to authenticate token.");
				next(err);
			} else {
				next();
			}
		});
	} else {
        // if there is no token
        // return an error
		let err = new Error("Need to login");
		next(err);
	}
};

router.use(sectionsRouter, loginRouter, authenticate, prereqsRouter, combinationsRouter, sessionsRouter, combinationsToSessions);

module.exports = router;
