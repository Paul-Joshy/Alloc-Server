const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports.User = mongoose.model('users', userSchema);

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
