module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();

    router.post('/login', userController.login);
    router.post('/signup', userController.signup);
    router.post('/fbuser', userController.fbuser);

    router.post('/upload', passport.authenticate('jwt', {session: false}), userController.upload);
    router.put('/update', passport.authenticate('jwt', {session: false}), userController.update);
    router.post('/unregister', passport.authenticate('jwt', {session: false}), userController.unregister);
    router.get('/fblogin', passport.authenticate('facebook', {session: false, scope: 'public_profile'}));
    router.get('/fbcallback', passport.authenticate('facebook', {session: false, failureRedirect: "/"}),
        function (req, res) {
            console.log(req.user);
            res.redirect("http://localhost:8080/#/fbsuccess?id=" + req.user.facebookId);
        });


    return router;

}