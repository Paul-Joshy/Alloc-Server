const _ = require('underscore');
const express = require('express');
const Router = new express.Router(); 

const {Session} = require('../models.js');

/* get all sessions */
Router.get('/sessions', function(req, res, next){
	Session.find({}, function(err, sessions){
		if(err) return next(err);
		res.status(200);
		res.json(sessions);
	});
});

/* create a session */
Router.post('/sessions', function(req, res, next){
	const session = new Session({
		name: req.body.name,
		start: req.body.start,
		end: req.body.end
	});

	session.save(function(err, session){
		if(err) return next(err);
		res.status(200);
		res.json(session);
	});
});

module.exports = Router;
