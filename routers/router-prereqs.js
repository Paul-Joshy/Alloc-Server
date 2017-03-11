const _ = require('underscore');
const express = require('express');
const router = express.Router();

const {Block, Room} = require('../models.js');

// if blockID exists in route
router.param('blockID', function(req, res, next, blockID){
	Block.findById(blockID, function(err, block){
		if(err) return next(err);
		if(block){
			req.block = block;
			next();
		} else {
			let err = new Error("block not found");
			err.stat = 404;
			return next(err);
		}
	});
});

// get blocks
router.get('/blocks', function(req, res, next){
	Block.find({}, '', function (err, blocks) {
		if(err) return next(err);
		res.status(200);
		res.json(blocks);
	});
});

// post new block
router.post('/blocks', function(req, res, next){
	let block = new Block({
		blockName: req.body.blockName,
		tag: req.body.tag
	});

	block.save( function(err, block) {
		if(err) return next(err);
		res.status(200);
		res.json(block);
	});
});

// get one block
router.get('/blocks/:blockID', function(req, res, next){
	res.status(200);
	res.json(req.block);
});

// remove one block
router.delete('/blocks/:blockID', function(req, res, next){
	Room.remove({block: req.block._id}, function(err){
		if(err) return next(err);
		Block.findByIdAndRemove(req.block._id, function(err){
			if(err) return next(err);
			res.status(200);
			res.send(req.block._id);
		});
	});
});

/************************
        Floors
************************/

router.param('floorID', function(req, res, next, floorID){
	req.floor = req.block.floors.id(floorID);
	next();
});

// get all floors
router.get('/blocks/:blockID/floors', function(req, res, next){
	res.status(200);
	res.json(req.block.floors);
});

// create a floor
router.post('/blocks/:blockID/floors', function(req, res, next){
	if( _.find(req.block.floors, function(floor){ return floor.number === parseInt(req.body.number); }) ) {
		let err = new Error("Floor already exists");
		err.errors = {
			number: {
				message: "Floor already exists",
				path: "number"
			}
		};
		next(err);
	} else {
		req.block.floors.push({
			number: req.body.number
		});
		req.block.save( function(err, block) {
			if(err) return next(err);
			res.status(200);
			res.json(block);
		});
	}
});

// get a floor
router.get('/blocks/:blockID/floors/:floorID', function(req, res, next){
	res.status(200);
	res.json(req.floor);
});

// delete a floor
router.delete('/blocks/:blockID/floors/:floorID', function(req, res, next){
	req.block.floors = _.reject(req.block.floors, function(floor){
		return floor._id === req.floor._id;
	});

	req.block.save( function(err) {
		if(err) return next(err);
		// delete all rooms after deleting the floor
		res.status(200);
		res.redirect(req.url + '/rooms');
	});
});


/************************
        Rooms
************************/

router.param("roomID", function(req, res, next, roomID){
	Room.findById(roomID, function(err, room){
		if(err) return next(err);
		req.room = room;
		next();
	});
});

// route to get all rooms
router.get('/blocks/:blockID/floors/:floorID/rooms', function(req, res, next){
	Room.find({ _id: {$in:req.floor.rooms} }, function(err, rooms){
		if(err) return next(err);
		res.status(200);
		res.json(rooms);
	});
});

// route to delete all rooms
router.delete('/blocks/:blockID/floors/:floorID/rooms', function(req, res, next){
	// remove rooms from floor collection
	Room.remove({floor: req.params.floorID}, function(err){
		if(err) return next(err);
		// remove rooms from block if floor exists, if not redirected by delete a floor
		if(req.floor){
			req.floor.rooms = [];
			req.block.save();
		}
		res.status(200);
		res.json(req.block);
	});
});

// route to create a room
router.post('/blocks/:blockID/floors/:floorID/rooms', function(req, res, next){
	const room = new Room({
		number: req.body.number,
		benches: req.body.benches,
		floor: req.floor._id,
		block: req.block._id
	});

	room.save(function(err, room){
		if(err) return next(err);
		// push new room to floor
		req.floor.rooms.push(room._id);
		// save block
		req.block.save();
		res.status(200);
		res.json(room);
	});
});

// route to get a room
router.get('/blocks/:blockID/floors/:floorID/rooms/:roomID', function(req, res, next){
	Room.findById(req.room._id, function(err, room){
		if(err) return next(err);
		res.json(room);
	});
});

// route to delete a room
router.delete('/blocks/:blockID/floors/:floorID/rooms/:roomID', function(req, res, next){
	Room.findByIdAndRemove(req.room._id, function(err){
		if(err) return next(err);
		req.floor.rooms = _.reject(req.floor.rooms, function(roomID){
			// req.room._id needs to be converted to string from ObjectID()
			return roomID == req.room._id + '';
		});
		req.block.save();
		res.status(200);
		res.json(req.block);
	});
});

module.exports = router;
