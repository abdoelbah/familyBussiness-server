const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username : {
        type : String,
    },
    password : {
        type : String,
    }
})

const model = mongoose.model('Users', userSchema)

module.exports = model