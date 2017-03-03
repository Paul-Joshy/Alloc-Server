const express = require('express');
const router = express.Router();

const {Block} = require('../models.js');

// get blocks
router.get('/blocks', function(req, res, next){
    Block.find({}, '', function (err, blocks) {
        if(err){
            return next(err);
        } else {
            res.status(200);
            res.json(blocks);
        }
    })
});

// post new block
router.post('/blocks', function(req, res, next){
    if(req.body && req.body.blockName && req.body.tag){
        Block.create({
            blockName: req.body.blockName,
            tag: req.body.tag
        }, function(err, block) {
            if(err){
                return next(err);
            } else {
                res.status(200);
                res.json(block);
            }
        });
    } else {
        let err = new Error("Block validation failed, not accepted");
        err.stat = 406;
        return next(err);
    }
});

// get one block
router.get('/blocks/:id', function(req, res, next){
    block_id = req.params.id;
    Block.findOne({_id: block_id}, function(err, block){
        if(err)
            return next(err);
        else{
            if(block){
                res.status(200);
                return res.json(block);
            } else {
                let err = new Error("block not found");
                err.stat = 404;
                return next(err);
            }
        }
    })
})

// remove one block
router.delete('/blocks/:id', function(req, res, next){
    block_id = req.params.id;
    Block.remove({_id: block_id}, function(err){
        if(err)
            return next(err);
        else{
            res.status(200);
            res.send(block_id);
        }
    })
})

module.exports = router;
