const mongoose = require('mongoose')

const region = mongoose.Schema({
    region: {
        type: 'string',
        required: true,
    },
    fullName: {
        type: 'string',
        required: true,
    },
    phone: {
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
    create_at: {
        type: 'Date',
        default: Date.now()
    }
})

module.exports = mongoose.model('region', region) 
