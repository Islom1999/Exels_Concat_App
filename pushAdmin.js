require('dotenv').config()
require('./config/connect')()

const Admin = require('./model/admin')

const admin = {
    fullName: "Karimov Islom",
    login: "Admin",
    password: "123456",
    phone: "+998972446972",
}

const addAdminDB = async () => {
    try{
        await Admin.create({
            fullName: "Karimov Islom",
            login: "Admin",
            password: "123456",
            phone: "+998972446972",
        })
        console.log('DB add Admin')
    }catch(err){
        console.log(err)
    }
}

addAdminDB()
