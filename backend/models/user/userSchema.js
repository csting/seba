var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    facebookId: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Date
    },
    surname: {
        type: String
    },
    lastname: {
        type: String
    },
    gender: {
      type: String  
    },
    type: {
        type: String,
        required: true
    },
    provider: {
        type: String
    },
    image: {
        type: String
    },
    facebook: {
        type: Object
    },
    token: {
        type: String
    }
});

userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var User = mongoose.model('User', userSchema);

module.exports = User;