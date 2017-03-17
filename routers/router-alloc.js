const _ = require('underscore');
const express = require('express');
const router = express.Router();

const {Block, Room} = require('../models.js');

// get blocks
router.get('/alloc/blocks', function(req, res, next){
	Block.find({}).populate('floors.rooms').exec( function(err, blocks) {
		if(err) return next(err);
		res.status(200);
		res.json(blocks);
	});
});

router.param("roomID", function(req, res, next, roomID){
	Room.findById(roomID, function(err, room){
		if(err) return next(err);
		req.room = room;
		next();
	});
});

// post batch to room
router.post('/alloc/rooms/:roomID', function(req, res, next){
	req.room.batches.push(req.body.batch);
	req.room.save( function(err){
		if(err) return next(err);
		res.status(200);
		res.send();
	});
});

// remove batch from room
router.put('/alloc/rooms/:roomID/batches', function(req, res, next){
	req.room.batches = _.reject(req.room.batches, (batch)=>{
		return batch.batch.toString() === req.body.batch.batch.toString();
	});

	req.room.save( function(err){
		if(err) return next(err);
		console.log(req.body.batch);
		res.status(200);
		res.send();
	});
});

module.exports = router;