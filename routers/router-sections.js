const _ = require('underscore');
const express = require('express');
const router = express.Router();
const {Blocks, Floors, Rooms} = require('../models.js');
const {Combinations, Batches} = require('../models.js');
const {Sessions} = require('../models.js');
// const {Allotment} = require('../models.js');

const {Section} = require('../models.js');

router.get('/sections/', function(req, res, next){
	Section.find( function(err, sections) {
		if(err) return next(err);
		if(sections.length===0){
			section = new Section({});
			section.save( function(err, section) {
				if(err) return next(err);
			});
		}
		res.send();
	});
});

router.put('/section/', function(req, res, next){
	
});

module.exports = router;