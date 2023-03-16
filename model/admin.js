const mongoose = require('mongoose')

const admins = mongoose.Schema({
    fullName: {
        type: 'string',
        required: true,
    },
    login: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    phone: {
        type: 'string',
        required: true,
    },
    create_at: {
        type: 'Date',
        default: Date.now()
    }
})

module.exports = mongoose.model('admins', admins) 
