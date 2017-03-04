const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
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

// parse body for application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse body for json
app.use(bodyParser.json())

// parse cookie
app.use(cookieParser());

//CHANGE



// serve static files
app.use('/frontend', express.static('../Alloc/public'));



// CHANGE

// routes
app.use(router);

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
