const mongoose = require('mongoose');

const cashSchema = new mongoose.Schema({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    patches: [{
        amount: {
            type: Number,
        },
        date: {
            type: Date,
            default: Date.now
        },
        counter: {
            type: String,
        },
        reciever: {
            type: String
        }
    }]
});

const Cash = mongoose.model('Cash', cashSchema);

module.exports = Cash;
