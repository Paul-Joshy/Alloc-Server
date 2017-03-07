const mongoose = require('mongoose');

module.exports.User = mongoose.model('users', require('./schemas/userSchema.js'));
module.exports.Block = mongoose.model('blocks', require('./schemas/blockSchema.js'));
