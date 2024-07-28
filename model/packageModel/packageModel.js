const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients', // Reference to the Clients model
        required: true
    },
    package: [{
        registererID: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        deliverer: {
            type: String,
            required: true
        },
        pack : [{
            quantity: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                default: 0
            }
        }]
    }]
});

const PackageModel = mongoose.model('packages', packageSchema);

module.exports = PackageModel;
