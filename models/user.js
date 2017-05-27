'use strict';
const mongoose = require('mongoose'),
      bcrypt   = require('bcryptjs');


let userSchema = mongoose.Schema({

    local            : {
        username     : String,
        email        : String,
        password     : String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        image        : String,
        notifications:Array
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
        image        : String,
    }

});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);