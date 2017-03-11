const express = require('express');
const Router = new express.Router;

const {Combination} = require('../models.js');

/* read all combinations */
Router.get('/combinations', function(req, res, next){
	Combination.find({}).populate('conflicts').sort( { _id : 1 } ).exec( function(err, combis){
		if(err) return next(err);
		res.status(200);
		return res.json(combis);
	});
});

/* update a combination */
Router.put("/combinations", function(req, res, next){
	const isConflicting = req.body.isConflicting;
	const current = req.body.current;
	const other = req.body.other;

	// if not conflicting, add conflicts
	if(!isConflicting){
		Combination.findByIdAndUpdate(current._id, { $push: { conflicts: other._id } }, function(err){
			if(err) return next(err);
			Combination.findByIdAndUpdate(other._id, { $push: { conflicts: current._id } }, function(err){
				if(err) return next(err);
				Combination.find({}).populate('conflicts').sort( { _id : 1 } ).exec( function(err, combis){
					if(err) return next(err);
					res.status(200);
					return res.json(combis);
				});
			});
		});
	} else {
		Combination.findByIdAndUpdate(current._id, { $pull: { conflicts: other._id } }, function(err){
			if(err) return next(err);
			Combination.findByIdAndUpdate(other._id, { $pull: { conflicts: current._id } }, function(err){
				if(err) return next(err);
				Combination.find({}).populate('conflicts').sort( { _id : -1 } ).exec( function(err, combis){
					if(err) return next(err);
					res.status(200);
					return res.json(combis);
				});
			});
		});
	}
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
	// update current combi with conflicts
	req.combi.conflicts.push(req.body.conflicting._id);
	req.combi.save(function(err, combi){
		if(err) return next(err);
		res.status(200);
		return res.json(combi);
	});
});

/* update a combination */
Router.put("/combinations/", function(req, res, next){
	// update current combi with conflicts
	req.combi.conflicts.push(req.body.conflicting._id);
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
		Combination.update({ $pull: { conflicts: req.combi._id }}, function(err){
			if(err) return next(err);
			Combination.find({}).populate('conflicts').sort( { _id : -1 } ).exec( function(err, combis){
				if(err) return next(err);
				res.status(200);
				return res.json(combis);
			});
		});
	});
});

module.exports = Router;