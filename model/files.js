const mongoose = require('mongoose')

const files = mongoose.Schema({
    region: {
        type: 'string',
        required: true,
    },
    fileName: {
        type: 'string',
        required: true,
    },
    status: {
        type: 'string',
        required: true,
    },
    create_at: {
        type: 'Date',
        default: Date.now()
    }
})

module.exports = mongoose.model('files', files) 
