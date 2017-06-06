var Trip = require('./tripSchema');

module.exports.saveTrip = function (req, res) {
    console.log(req.body);
    var trip = new Trip({
        title: req.body.title,
        locations: req.body.trip,
        user: req.body.user

    });

    trip.save(function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
    });
};
module.exports.getTrips = function (req, res) {

    Trip.find({user: req.query.email}, function (err, trips) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!trips) {
            res.status(401).send("You haven't created a trip yet");
            return;
        }

        res.status(200).json(trips);
    });
};

module.exports.getAllTrips = function (req, res) {

    Trip.find(function (err, trips) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!trips) {
            res.status(401).send("There are no trips");
            return;
        }

        res.status(200).json(trips);
    });
};

module.exports.getTrip = function(req, res) {
    // Use the Beer model to find a specific beer
    console.log("AAA");
    console.log(req.query.id);
    Trip.findById(req.query.id, function(err, trip) {
        console.log("AAA");
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(trip);
    });
};

module.exports.updateTrip = function(req, res) {
    // Use the Beer model to find a specific beer
    console.log("Updating...");
    console.log(req.body);
    Trip.findByIdAndUpdate(req.body.id, {$set: {locations: req.body.trip.destinations, title: req.body.trip.name}}, {upsert:false}, function(err, trip) {
        console.log("Now...");
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(trip);
    });
};
module.exports.deleteTrip = function (req, res) {
    console.log(req.params._id);
    Trip.findById(req.params._id, function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        } else {
            m.remove();
            res.sendStatus(200);
        }
    }).remove();
};
