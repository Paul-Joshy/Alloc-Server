const express = require('express');
const Router = new express.Router;

const {Combination} = require('../models.js');

/* read all combinations */
Router.get('/combinations', function(req, res, next){
	Combination.find({}, function(err, combis){
		if(err) return next(err);
		res.status(200);
		return res.json(combis);
	});
});

/* delete all combinations */
Router.delete('/combinations', function(req, res, next){
	Combination.remove({}, function(err, combis){
		if(err) return next(err);
		res.status(200);
		return res.json(combis);
	});
});

/* create a combination */
Router.post('/combinations', function(req, res, next){
	const combi = new Combination({
		name: req.body.name,
		gradLevel: req.body.gradLevel,
		duration: req.body.duration,
	});

	combi.save(function(err, combi){
		if(err) return next(err);
		res.status(200);
		return res.json(combi);
	});
});

/* middleware for all with param combiID */
Router.param("combiID", function(req, res, next, combiID){
	Combination.findById(combiID, function(err, combi){
		if(err) return next(err);
		req.combi = combi;
		next();
	});
});

/* read a combination */
Router.get("/combinations/:combiID", function(req, res, next){
	res.status(200);
	res.json(req.combi);
});

/* update a combination */
Router.put("/combinations/:combiID", function(req, res, next){
	req.combi.conflicts = req.body.conflicts;
	req.combi.save(function(err, combi){
		if(err) return next(err);
		res.status(200);
		return res.json(combi);
	});
});

/* delete a combination */
Router.delete("/combinations/:combiID", function(req, res, next){
	Combination.findByIdAndRemove(req.combi._id, function(err){
		if(err) return next(err);
		res.status(200);
		res.json(req.combi);
	});
});

module.exports = Router;