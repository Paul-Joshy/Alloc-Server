const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

/* Users */

const userSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
          validator: function(v) {
              if(v.length>2) return true;
              return false;
          },
          message: 'Username needs to be longer than two characters'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
              if(v.length>8) return true;
              return false;
          },
          message: 'Password needs to be longer than eight characters'
        }
    }
})

userSchema.pre("save", function(next){
    /* generate hash before save method */
    this.password = bcrypt.hashSync(this.password);
    next();
});

module.exports.User = mongoose.model('users', userSchema);

/* Floors */

const floorSchema = new Schema({
    num: {
        type: Number,
        unique: true,
        required: true
    }
});

/* Blocks */

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

blockSchema.pre("save", function(next){
    next();
});

module.exports.Block = mongoose.model('blocks', blockSchema);
