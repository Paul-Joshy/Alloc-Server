const express = require('express');
let router = express.Router();

const blocksRouter = require('./router-blocks.js');

router = Object.assign(router, blocksRouter);

module.exports = router;
