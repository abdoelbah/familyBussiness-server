const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const model = mongoose.model('Clients', clientSchema); 

module.exports = model;
