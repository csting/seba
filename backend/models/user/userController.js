var Config = require('../../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');

module.exports.login = function (req, res) {

    if (!req.body.email) {
        res.status(400).send('Email required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('Password required');
        return;
    }

    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch || err) {
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};


module.exports.fbuser = function (req, res) {

    console.log(req.body);

    if (!req.body.id) {
        res.status(400).send('ID required');
        return;
    }

    User.findOne({facebookId: req.body.id}, function (err, user) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid User');
            return;
        }

        res.status(200).json({token: createToken(user)});
    });

};


module.exports.upload = function (req, res) {

    var userEmail = req.body.data.email;
    var userImage = req.body.data.file;


    if (!userImage) {
        res.status(400).send('picture required');
        return
    }

    if (!userEmail) {
        res.status(400).send('email required');
        return
    }

    console.log("Hello");

    User.findOneAndUpdate({email: userEmail}, {image: userImage}, {new: true}, function (err, user) {
        if (err) {
            console.log('got an error');
            res.status(500).send(err);
            return
        }

        console.log(user);

        res.status(201).json({token: createToken(user)});
        return
    });

};

module.exports.signup = function (req, res) {

    console.log(req.body);

    if (!req.body.email) {
        res.status(400).send('Email required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('Password required');
        return;
    }

    User.findOne(
        {email: req.body.email},
        function (err, user) {
            if (err) deferred.reject(err);
            if (user) {
                res.status(400).send('User already taken');
                return;
            } else {

                var user = new User();

                user.email = req.body.email;
                user.password = req.body.password;
                user.surname = req.body.surname;
                user.lastname = req.body.lastname;
                user.type = req.body.type;
                user.age = req.body.age;

                user.save(function (err) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }

                    res.status(201).json({token: createToken(user)});
                });
            }

        });

};

module.exports.update = function (req, res) {

    var updatedUser = new User();

    if (req.body.oldPassword & !req.body.newPassword) {
        res.status(401).send('If you want to change your password please enter a new one');
        return;
    }

    updatedUser.email = req.body.email;
    updatedUser.oldPassword = req.body.oldPassword;
    updatedUser.newPassword = req.body.newPassword;
    updatedUser.surname = req.body.surname;
    updatedUser.lastname = req.body.lastname;
    updatedUser.age = req.body.age;


    User.findOne(
        {email: updatedUser.email},
        function (err, user) {
            if (err) deferred.reject(err);

            if (user && updatedUser.newPassword) {
                user.comparePassword(updatedUser.oldPassword, function (err, isMatch) {
                    if (!isMatch || err) {
                        res.status(401).send('Wrong password');
                    }
                    updateUser(updatedUser.newPassword, user)
                });

            } else if (user) {
                updateUserWithoutNewPassword(user);
            }
            else {
                deferred.reject('Error')
            }
        });


    function updateUserWithoutNewPassword(oldUser) {
        var set = {
            email: updatedUser.email,
            surname: updatedUser.surname,
            lastname: updatedUser.lastname,
            age: updatedUser.age
        };

        User.findOneAndUpdate({email: updatedUser.email}, {$set: set}, {new: true}, function (err, user) {
                if (err) {
                    console.log('got an error');
                    res.status(500).send(err);
                    return
                }

                console.log("new User!");
                console.log(user);

                res.status(201).json({token: createToken(user)});
                return
            }
        );
    }

    function updateUser(password, oldUser) {

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(password, salt, null, function (err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one

                var set = {
                    _id: oldUser.id,
                    email: updatedUser.email,
                    password: hash,
                    surname: updatedUser.surname,
                    lastname: updatedUser.lastname,
                    type: oldUser.type,
                    age: updatedUser.age
                };

                finalUser = new User();

                finalUser._id = oldUser._id;
                finalUser.email = updatedUser.email;
                finalUser.surname = updatedUser.surname;
                finalUser.lastname = updatedUser.lastname;
                finalUser.type = oldUser.type;
                finalUser.age = updatedUser.age;


                User.update(
                    {email: updatedUser.email}, {$set: set})
                    .then(function (user) {
                        res.status(201).json({token: createToken(finalUser)});
                        return;
                    }, function (err) {
                        res.status(500).send(err);
                        return;
                    });
            })
        })
    };
};

module.exports.unregister = function (req, res) {
    User.findOneAndRemove({_id: req.body.id}).then(function (user) {
        res.sendStatus(200);
    }, function (err) {
        res.status(500).send(err);
    });
};

function createToken(user) {
    var tokenPayload = {
        user: {

            _id: user._id,
            surname: user.surname,
            lastname: user.lastname,
            facebookId: user.facebookId,
            password: user.id + user.token,
            type: user.type,
            email: user.email,
            image: user.image,
            provider: user.provider,
            facebook: user.facebook,
            age: user.age
        }

    };
    return jwt.encode(tokenPayload, Config.auth.jwtSecret);
};