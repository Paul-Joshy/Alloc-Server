const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
	number: {
		type: Number,
		unique: true,
		required: true
	}
});

module.exports = roomSchema;