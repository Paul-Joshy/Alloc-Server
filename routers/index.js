const express = require('express');
const jwt = require('jsonwebtoken');
let router = express.Router();

const prereqsRouter = require('./router-prereqs.js');
const loginRouter = require('./login.js');

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

router.use(loginRouter, authenticate, prereqsRouter);

module.exports = router;
