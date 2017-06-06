var Deal = require('./dealSchema');

module.exports.saveDeal = function (req, res) {
    console.log(req.body);
    
    var deal = new Deal({
        name: req.body.deal.name,
        location: req.body.deal.location,
        shortdescription: req.body.deal.shortdescription,
        category: req.body.deal.category,
        conditions: req.body.deal.conditions,
        amount: req.body.deal.amount,
        startdate: req.body.deal.startdate,
        enddate: req.body.deal.enddate,
        daysleft: req.body.deal.daysleft,
        targetgroup: req.body.deal.targetgroup,
        targetgroupgender: req.body.deal.targetgroupgender,
        targetgroupage: req.body.deal.targetgroupage,
        picture: req.body.deal.picture,
        email: req.body.email
    });
    
    //Mongoose Magic -> neues schema mit diesem Deal
    deal.save(function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
    });
};

module.exports.getDeals = function (req, res) {
    Deal.find({email: req.query.email}, function (err, deals) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!deals) {
            res.status(401).send("You haven't created a deal yet");
            return;
        }

        res.status(200).json(deals);
    });
};

module.exports.getAllDeals = function (req, res) {
    Deal.find(function (err, deals) {
        if (err) {
            res.status(500).send(err);
            return
        }
        if (!deals) {
            res.status(401).send("There are no other offers in your area");
            return;
        }
        res.status(200).json(deals);
    });
};