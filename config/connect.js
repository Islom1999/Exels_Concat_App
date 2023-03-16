const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        const MONGO_URI = process.env.MONGO_URI
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true
        })
        console.log(`Connect MONGO_DB : ${MONGO_URI}`)
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB