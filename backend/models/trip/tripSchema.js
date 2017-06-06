// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var tripSchema   = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    locations: {
        type: [],
        required: true
    },
    user: {
        type: String,
        required: true
    }
});


// Export the Mongoose model
var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;