// Load required packages
var mongoose = require('mongoose');

// Define our deal schema
var dealSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    location: {
        type: [],
        required: false
    },
    shortdescription: {
        type: String,
        required: false
    },
    category: {
        type: [],
        required: false
    },
    conditions: {
        type: String,
        required: false
    }, 
    amount: {
        type: Number,
        required: false
    },
    startdate: {
        type: Date,
        required: false
    }, 
    enddate:{
        type: Date,
        required: false
    },
    daysleft:{
        type: Number,
        required: false
    },
    targetgroup: {
        type: String,
        required: false
    }, 
    targetgroupgender: {
        type: [],
        required: false
    }, 
    targetgroupage: {
        type: [],
        required: false
    }, 
    picture: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    }
});


// Export the Mongoose model
var Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;