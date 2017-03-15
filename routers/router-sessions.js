const _ = require('underscore');
const express = require('express');
const Router = new express.Router(); 

const {Session} = require('../models.js');

Router.param("sessionID", function(req, res, next, sessionID){
	Session.findById(sessionID).exec(function(err, session){
		if(err) return next(err);
		req.session = session;
		next();
	});
});

/* get all sessions */
Router.get('/sessions', function(req, res, next){
	//.populate("batches.combination")
	Session.find({}).exec(function(err, sessions){
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

/* delete a session */
Router.delete('/sessions/:sessionID', function(req, res, next){
	Session.findByIdAndRemove(req.session, function(err, session){
		if(err) return next(err);
		res.json(session);
	});
});

module.exports = Router;
