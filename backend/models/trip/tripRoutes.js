module.exports = tripRoutes;

function tripRoutes(passport) {

    var tripController = require('./tripController');
    var router = require('express').Router();
    var unless = require('express-unless');
    
    passport.authenticate('jwt', {session: false})

    router.post('/saveTrip', passport.authenticate('jwt', {session: false}), tripController.saveTrip);
    router.delete('/deleteTrip/:_id', passport.authenticate('jwt', {session: false}), tripController.deleteTrip);
    router.get('/trip', passport.authenticate('jwt', {session: false}), tripController.getTrips);
    router.get('/trips', passport.authenticate('jwt', {session: false}), tripController.getAllTrips);
    router.get('/editTrip', passport.authenticate('jwt', {session: false}), tripController.getTrip);
    router.put('/updateTrip', passport.authenticate('jwt', {session: false}), tripController.updateTrip);

    return router;
}