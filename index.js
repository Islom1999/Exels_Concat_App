const express = require('express')
const {engine} = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const connectDB = require('./config/connect')

//env config
require('dotenv').config() 
// Database Connect
connectDB() 

const server = express()

const store = new MongoStore({
    collection: 'sessions',
    uri: process.env.MONGO_URI
})

server.use(session({
    secret: process.env.SECTION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

// JSON init
server.use(express.json())
server.use(express.urlencoded({extended: false}))

// HBS init
server.engine('.hbs', engine({extname: '.hbs'}))
server.set('view engine', '.hbs') 

// Public folder static init
server.use(express.static(path.join(path.dirname(__filename), 'utils', 'public')))

// Routers add
server.use('/', require('./router/route'))

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server run: ${PORT}`)
})