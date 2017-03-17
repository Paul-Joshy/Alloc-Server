const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchSchema = require('../models.js').batchSchema;

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
		required: true
	},
	benches: {
		type: Number,
		required: true
	},
	batches: [{
		combination: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'combinations'
		},
		batch: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'combinations.batches'
		},
		side: {
			type: String,
			enum: ["left", "right"]
		}
	}]
});

module.exports = roomSchema;