/**
 *
 * Created by thorbenknichwitz on 29/06/16.
 *
 */
var User = require('../models/user/userSchema');
var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function (passport) {
    passport.use(new FacebookStrategy({
            clientID: 630316213785028,
            clientSecret: "a6399460266deb6230c3641e94137bbd",
            callbackURL: "http://localhost:3000/fbcallback",
            profileFields: ['id', 'displayName', 'link', 'photos', 'email']
        },
        function (accessToken, refreshToken, profile, done) {

            User.findOne({
            'facebook.id': profile.id
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                //No user was found... so create a new user with values from Facebook (all the profile. stuff)
                if (!user) {

                    if (profile.emails[0].value == null){

                    }

                    var name = profile.displayName.split(" ");
                    var email = profile.emails[0].value;

                    if (email == null){
                        email = name[0]+"."+name[1]+"@facebook.com";
                    }
                    
                    user = new User({
                        surname: name[0],
                        lastname: name[1],
                        facebookId: profile.id,
                        password: profile.id + accessToken,
                        type: "traveler",
                        email: email,
                        image: profile.photos[0].value,
                        provider: 'facebook',
                        //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                        facebook: profile._json,
                        token: accessToken
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    //found user. Return
                    return done(err, user);
                }
            });
        }
    ));
}