const _ = require('underscore');
const express = require('express');
const router = express.Router();

const {Block} = require('../models.js');

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
    })
});

// get blocks
router.get('/blocks', function(req, res, next){
    Block.find({}, '', function (err, blocks) {
        if(err) return next(err);
        res.status(200);
        res.json(blocks);
    })
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
})

// remove one block
router.delete('/blocks/:blockID', function(req, res, next){
    Block.remove({_id: req.block._id}, function(err){
        if(err) return next(err);
        res.status(200);
        res.send(req.block._id);
    })
})

/************************
        Floors
************************/

router.param('floorID', function(req, res, next, floorID){
    req.floor = req.block.floors.id(floorID);
    next();
})

// get all floors
router.get('/blocks/:blockID/floors', function(req, res, next){
    res.status(200);
    res.json(req.block.floors);
});

// create a floor
router.post('/blocks/:blockID/floors', function(req, res, next){
    Block.findOne( {_id: req.block._id, floors: { $elemMatch: { number: req.body.number } } }, function(err, floor){
        if(floor){
            let err = new Error("Floor already exists");
            err.errors = {
                number: {
                    message: "Floor already exists",
                    path: "number"
                }
            }
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

    req.block.save( function(err, block) {
        if(err) return next(err);
        res.status(200);
        res.json(block);
    });
});

module.exports = router;
