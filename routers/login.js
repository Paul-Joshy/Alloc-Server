const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const {User} = require("../models.js");

/* route to get existing users if exists, if not - should register */
router.get('/login', function(req, res, next){
	/* check if app user exists */
	User.find({}).exec(function(err, users){
		if(err) return next(err);
		if(users.length)
			res.status(200);
		else
			res.status(400);
		res.send("users exist");
	});
});

/* for registration */
router.post('/register', function(req, res, next){
    /* check if password was correctly repeated twice */
	if(req.body.password === req.body.confirmPassword){
        /* create new user with req values */
		let user = new User({
			userName: req.body.userName,
			password: req.body.password
		});

		user.save( function(err){
			if(err) return next(err);
			res.status(200);
			return res.send("New user registered");
		});
	
	} else {
		let err = {};
		err.errors = {
			confirmPassword: {
				message: "Passwords don't match"
			}
		};
		err.stat = 400;
		return next(err);
	}
});

/* for login */
router.post('/login', function(req, res, next){
    /* check if all fields were filled */
	if(req.body && req.body.userName && req.body.password){
		User.findOne({userName: req.body.userName}, {userName:true, password: true}, function(err, user){
			if(err) return next(err);
			if(user){
				if (bcrypt.compareSync(req.body.password, user.password)){
                    /* if user is found and password is right */
                    /* create a token */
					let token = jwt.sign(user, "super-secret-key", {
						expiresIn: 60*60*24 // expires in 1 day
					});
					res.cookie("token", token);
					res.cookie("userName", user.userName);
					res.cookie("_id", user._id);
					res.status(200);
					res.json({
						_id: user._id,
						userName: user.userName
					});
				} else {
					let err = new Error("Wrong password");
					err.stat = 400;
					return next(err);
				}
			} else {
				let err = new Error("User doesn't exist");
				err.stat = 400;
				return next(err);
			}
		});
	} else {
		let err = new Error("Fields cannot be empty");
		err.stat = 400;
		return next(err);
	}
});

/* for updating password */
router.put('/login', function(req, res, next){
	/* check if password was correctly repeated twice */
	if(req.body.newPwd === req.body.repPwd && req.body.newPwd.length){
        /* update user password */
		User.findOne({userName: req.body.userName}, function(err, user){
			if(err) return next(err);
			if(user){
				if (bcrypt.compareSync(req.body.oldPwd, user.password)){
					/* if oldPwd matches */
					user.password = req.body.newPwd;
					user.save(function(err){
						if(err) return next(err);
						res.status(200);
						res.send("success");
					});
				} else {
					let err = {};
					err.errors = {
						oldPwd: {
							message: "Wrong Password",
							path: "oldPwd"
						}
					};
					err.stat = 400;
					return next(err);
				}
			}
		});
	} else {
		let err = {};
		err.errors = {
			repPwd: {
				message: "Passwords don't match",
				path: "repPwd"
			}
		};
		err.stat = 400;
		return next(err);
	}
});

module.exports = router;
