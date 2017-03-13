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
		required: true,
		uppercase: true
	},
	strength: {
		type: Number,
		required: true,
		min: 1
	},
	exclusions: [
		{
			type: Number,
			required: true
		}
	]
});

batchSchema.pre("save", function(next){
	/* year should fall within duration */
	if(this.year > this.parent().duration){
		next(new Error("batch should fall within combination duration"));
	}
	next();
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
	// remove any duplicate conflicts
	this.conflicts = _.uniq(this.conflicts, function(conflict){ return conflict.toString(); });
	// remove self conflict in conflicts
	this.conflicts = _.reject(this.conflicts, (conflict)=>{ return this._id.toString() === conflict.toString(); });
	/* number of batches cannot exceed duration years */
	if(this.batches.length > this.duration)
		next(new Error("Number of batches cannot exceed duration years"));
	next();
});

module.exports = CombinationSchema;