const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./routers/index.js');

const app = express();
const PORT = 3000 || process.env.PORT;

// flag to check if mongoDB connection has been established or not
app.set('isMongoUP', true);

//mongoose.connect(`mongodb://JSDevL:arfathandypaul1234@ds113630.mlab.com:13630/alloc-db`);
mongoose.connect('mongodb://localhost/alloc-db');
const db = mongoose.connection;
db.on('error', function(err){
	app.set('isMongoUP', false);
});

app.use(function(req, res, next){
	if(app.get('isMongoUP') === false)
		res.send("mongo down");
	next();
});

// logger
app.use(morgan('dev'));

// parse body for application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse body for json
app.use(bodyParser.json());

// parse cookie
app.use(cookieParser());

// serve static files
app.use('/app', express.static('../Alloc/public'));

// redirect to app root on URI root
router.use(function(req, res, next){
	if(req.url == "/" && req.method.toUpperCase() == "GET")
		res.redirect('/app');
	else
		next();
});

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
	res.json({
		message: err.message,
		errors: err.errors
	});
});

app.listen(PORT, function(){
	console.log(`App running on port ${PORT}`);
});
