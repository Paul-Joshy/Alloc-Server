const _ = require('underscore');
const express = require('express');
const Router = new express.Router(); 

const {Session} = require('../models.js');

Router.param("sessionID", function(req, res, next, sessionID){
	Session.findById(sessionID, function(err, session){
		if(err) return next(err);
		req.session = session;
		next();
	});
});

/* add batch to session */
Router.post("/sessions/:sessionID/combinations", function(req, res, next){
	const combi_ID = req.body.combi_ID;
	const batch_ID = req.body.batch_ID;

	req.session.batches.push({
		combination: combi_ID,
		batch: batch_ID
	});
	req.session.save(function(err, session){
		if(err) return next(err);
		res.status(200);
		res.json(session);
	});
});

/* remove batch from session */
Router.put("/sessions/:sessionID/combinations", function(req, res, next){
	const combi_ID = req.body.combi_ID;
	const batch_ID = req.body.batch_ID;
	console.log();
	req.session.batches = _.reject(req.session.batches, function(batchInSession){
		return batchInSession.combination.toString() === combi_ID.toString() && batchInSession.batch.toString() === batch_ID.toString();
	});
	req.session.save(function(err, session){
		if(err) return next(err);
		res.status(200);
		res.json(session);
	});
});


module.exports = Router;
