const _ = require('underscore');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchSchema = new Schema({
	year: {
		type: Number,
		required: true
	},
	prefix: {
		type: String,
		required: true
	},
	strength: {
		type: Number,
		required: true
	},
	exclusions: [
		{
			type: Number,
			required: true
		}
	]
});

const CombinationSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		maxlength: [6, "Combination name cannot exceed 6 characters"]
	},
	gradLevel: {
		type: String,
		required: true,
		trim: true,
		uppercase: true,
		enum: ['UG', 'PG']
	},
	duration: {
		type: Number,
		required: true,
		min: [1, "Degree years can only be between 1 to 4"],
		max: [4, "Degree years can only be between 1 to 4"]
	},
	conflicts: [{ 
		type : mongoose.Schema.Types.ObjectId, 
		ref: 'combinations'
	}],
	batches: [batchSchema]
});

CombinationSchema.pre("save", function(next){
	// remove any duplicates
	this.conflicts = _.uniq(this.conflicts, function(conflict){ return conflict.toString(); });
	// check if combi is conflicting with self and remove
	this.conflicts = _.reject(this.conflicts, (conflict)=>{ return this._id.toString() === conflict.toString(); });
	next();
});

module.exports = CombinationSchema;