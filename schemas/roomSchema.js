const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
	block: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'blocks'
	},
	floor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'floors'
	},
	number: {
		type: Number,
		unique: true,
		required: true
	},
	benches: {
		type: Number,
		required: true
	}
});

module.exports = roomSchema;