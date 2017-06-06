module.exports = dealRoutes;

function dealRoutes(passport) {

    var dealController = require('./dealController');
    var router = require('express').Router();
    
    router.post('/saveDeal', passport.authenticate('jwt', {session: false}), dealController.saveDeal);
    router.get('/deal', passport.authenticate('jwt', {session: false}), dealController.getDeals);
    router.get('/alldeals', passport.authenticate('jwt', {session: false}), dealController.getAllDeals);


    return router;
}
