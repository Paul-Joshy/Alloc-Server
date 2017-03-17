const mongoose = require('mongoose');
/* Registration, Login */
module.exports.User = mongoose.model('users', require('./schemas/userSchema.js'));
/* Routing validation */
module.exports.Section = mongoose.model('section', require('./schemas/sectionsSchema.js'));
/* Room */
module.exports.Room = mongoose.model('rooms', require('./schemas/roomSchema.js'));
/* Block, Floor */
module.exports.Block = mongoose.model('blocks', require('./schemas/blockSchema.js'));
/* Combination */
module.exports.Combination = mongoose.model('combinations', require('./schemas/combinationSchema.js'));
/* Sessions */
module.exports.Session = mongoose.model('sessions', require('./schemas/sessionSchema.js'));
