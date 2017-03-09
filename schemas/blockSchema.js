const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const floorSchema = new Schema({
	number: {
		type: Number,
		required: true,
		validate: {
			validator: function(v) {
				if(v <= 10) return true;
				return false;
			},
			message: "Cannot be more than 10"
		}
	},
	rooms: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rooms'
	}]
});

const blockSchema = new Schema({
	blockName: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	tag: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		validate: {
			validator: function(v) {
				if(v.length <= 3) return true;
				return false;
			},
			message: "Tag name shouldn't be more than 3 characters"
		}
	},
	floors: [floorSchema]
});

module.exports = blockSchema;
