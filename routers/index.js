const express = require('express');
const jwt = require('jsonwebtoken');
let router = express.Router();

const blocksRouter = require('./router-blocks.js');
const loginRouter = require('./login.js');

const authenticate = function(req, res, next) {
    // check query for token
    var token = req.cookies.token
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, "super-secret-key", function(err, decoded) {
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
}

router.use(loginRouter, authenticate, blocksRouter);

module.exports = router;
