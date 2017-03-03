const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

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
        required: true
    }
});

module.exports.Block = mongoose.model('blocks', blockSchema);
