const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		enum: ['morning', 'afternoon', 'evening']
	},
	start: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: function(v) {
				return /^\d{2}:\d{2}$/.test(v);
			}
		}
	},
	end: {
		type: String,
		required: true,
		trim: true,
		validate: {
			validator: function(v) {
				return /^\d{2}:\d{2}$/.test(v);
			}
		}
	}
});

module.exports = sessionSchema;