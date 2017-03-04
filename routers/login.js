const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const {User} = require("../models.js");

router.post('/register', function(req, res, next){
    if(req.body && req.body.userName && req.body.password && req.body.confirmPassword){
        if(req.body.password === req.body.confirmPassword){
            var hash = bcrypt.hashSync(req.body.password);
            User.create({
                userName: req.body.userName,
                password: hash
            });
            res.status(200);
            return res.send("New user created");
        } else {
            let err = new Error("Passwords don't match");
            err.stat = 400;
            return next(err);
        }
    } else {
        let err = new Error("Fields cannot be empty")
        err.stat = 400;
        return next(err);
    }
});

router.post('/login', function(req, res, next){
    if(req.body && req.body.userName && req.body.password){
        User.findOne({userName: req.body.userName}, {password: true}, function(err, user){
            if(err){
                return next(err);
            } else {
                if(user){
                    if (bcrypt.compareSync(req.body.password, user.password)){
                        // if user is found and password is right
                        // create a token
                        let token = jwt.sign(user, "super-secret-key", {
                            expiresIn: 60*60 // expires in 1 hour
                        });

                        res.cookie("token", token);
                        res.send("token sent")
                    } else {
                        let err = new Error("Wrong!!");
                        err.stat = 400;
                        return next(err);
                    }
                } else {
                    let err = new Error("User doesn't exist");
                    err.stat = 400;
                    return next(err);
                }
            }
        })
    } else {
        let err = new Error("Fields cannot be empty")
        err.stat = 400;
        return next(err);
    }
});

module.exports = router;
