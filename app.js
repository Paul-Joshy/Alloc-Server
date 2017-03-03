const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./routers/index.js');

const app = express();
const PORT = 3000 || process.env.PORT;

mongoose.connect(`mongodb://JSDevL:arfathandypaul1234@ds113630.mlab.com:13630/alloc-db`);
const db = mongoose.connection;
db.on('error', function(err){
    console.log(err);
});

// logger
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routes
app.use(router);

//CHANGE



// serve static files
app.use('/frontend', express.static('../allotment/public'));



// CHANGE

// 404 generator
app.use(function(req, res, next){
    const err = new Error("404 not found pal");
    err.stat = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next){
    res.status(err.stat || 500);
    res.send(`error ${err.message}`);
});

app.listen(PORT, function(){
    console.log(`App running on port ${PORT}`);
});
