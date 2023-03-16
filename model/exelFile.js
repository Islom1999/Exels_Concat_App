const mongoose = require('mongoose')

const exelFiles = mongoose.Schema({
    fileName: {
        type: 'string',
        required: true,
    },
    create_at: {
        type: 'Date',
        default: Date.now()
    }
})

module.exports = mongoose.model('exelFiles', exelFiles) 
