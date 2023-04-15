const {Router} = require('express')
const upload = require('../utils/fileUpload')
const { exelAdd } = require('../utils/exelAdd')
const fs = require('fs')
const path = require('path')

const Admin = require('../model/admin')
const Region = require('../model/region')
const Files = require('../model/files')
const ExelFile = require('../model/exelFile')

const {protectedUser, protectedAdmin} = require('../middleware/auth')

const route = Router()

route.get('/', protectedUser, async(req, res) => {
    try{
        const file = await ExelFile.find().lean()

        let isAdmin = false
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }
        res.render('home', {
            isAdmin,
            fileURL: file[0] ?  file[0].fileNameExample : false
        })

    }catch(err){
        console.log(err)
    }
})

route.get('/login',async(req, res) => {
    try{
        res.render('login', {
            loginPage: true
        })

    }catch(err){
        console.log(err)
    }
})

route.post('/login', async(req, res) => {
    try{
        const {login, password} = req.body
    
        const region = await Region.findOne({login}).lean()

        if(Boolean(region)){
            if(region.password == password){ 
                req.session.user = region.login 
                req.session.isLogin = true
                req.session.isAdmin = false
                req.session.save()


                return res.redirect('/')
            }else{
                return res.redirect('/login')
            }
        }else{
            return res.redirect('/login')
        }
    

    }catch(err){
        console.log(err)
    }
})

route.get('/admin/login',async(req, res) => {
    try{
        res.render('admin/login', {
            loginPage: true
        })

    }catch(err){
        console.log(err)
    }
})

route.post('/logout', async(req, res) => {
    try{
        req.session.user = null 
        req.session.isLogin = false
        req.session.isAdmin = false
        req.session.save()
        return res.redirect('/login')    

    }catch(err){
        console.log(err)
    }
})

route.post('/admin/login', async(req, res) => {
    try{
        const {login, password} = req.body
    
        const admin = await Admin.findOne({login}).lean()

        if(Boolean(admin)){
            if(admin.password == password){ 
                req.session.user = admin.login 
                req.session.isLogin = true
                req.session.isAdmin = true
                req.session.save()

                console.log('login')

                return res.redirect('/')
            }else{
                return res.redirect('/admin/login')
            }
        }else{
            return res.redirect('/admin/login')
        }
    

    }catch(err){
        console.log(err)
    }
})

route.get('/user/files',protectedUser, async(req, res) => {
    try{

        const files = await Files.find({region: req.session.user}).lean()

        let isAdmin = false
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }

        files.forEach(item => {
            if(item.create_at){
                const date = item.create_at.toLocaleString()
                item.create_at = date 
            }
        })

        res.render('filesUser', {
            isAdmin,
            files,
        })

    }catch(err){
        console.log(err)
    }
})

route.get('/all/files', protectedUser, protectedAdmin, async(req, res) => {
    try{

        const files = await Files.find().lean()

        let isAdmin = false
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }

        files.forEach(item => {
            if(item.create_at){
                const date = item.create_at.toLocaleString()
                item.create_at = date 
            }
        })
        files.forEach(item => {
            if(item.status !== 'active'){
                item.status = false 
            }
        })

        res.render('filesAll', {
            isAdmin,
            files
        })

    }catch(err){
        console.log(err)
    }
})

route.get('/region',protectedUser, protectedAdmin, async(req, res) => {
    try{

        const region = await Region.find().lean()

        let isAdmin = false
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }

        region.forEach(item => {
            if(item.create_at){
                const date = item.create_at.toLocaleString()
                item.create_at = date 
            }
        })

        res.render('region', {
            isAdmin,
            region
        })

    }catch(err){
        console.log(err)
    }
})
route.post('/admin/region/delete/:id',protectedUser, protectedAdmin, async(req, res) => {
    try{

        await Region.findByIdAndDelete(req.params.id)
        res.redirect('/region')

    }catch(err){
        console.log(err)
    }
})

route.get('/exelfile',protectedUser, protectedAdmin, async(req, res) => {
    try{

        const file = await ExelFile.find().lean()

        let isAdmin = false
        if(req.session.isAdmin){
            isAdmin = req.session.isAdmin
        }

        res.render('asosiyFile', {
            isAdmin,
            fileURL: file[0] ?  file[0].fileName : '/ 404 Error'
        })

    }catch(err){
        console.log(err)
    }
})

route.post('/file/add',protectedUser, upload.single('file'), async(req, res) => {
    try{
        // exelAdd(req.file.filename)

        await Files.create({
            region: req.session.user,
            fileName: '/upload/' + req.file.filename,
            status: 'inActive'
        })

    
        res.redirect('/user/files')

    }catch(err){
        console.log(err)
    }
})

route.post('/admin/file/delete/:id',protectedUser, protectedAdmin, async(req, res) => {
    try{

        const file = await Files.findById(req.params.id).lean()

        console.log(file)
 
        await Files.findByIdAndDelete(req.params.id)

        fs.unlink(path.join(__dirname, '../', 'utils', 'public', file.fileName), (err) => { console.log(err) }); 


    
        res.redirect('/all/files')

    }catch(err){
        console.log(err)
    }
})

route.post('/admin/file/addexel/:id',protectedUser, protectedAdmin, async(req, res) => {
    try{

        const file = await Files.findById(req.params.id)
        exelAdd(file.fileName)

        await Files.findByIdAndUpdate(req.params.id, {status: 'active'})
    
        res.redirect('/all/files')

    }catch(err){
        console.log(err)
    }
})

route.post('/admin/region/add',protectedUser, protectedAdmin, async(req, res) => {
    try{

        const {region, fullName, phone, login, password} = req.body

        await Region.create({
            region, fullName, phone, login, password
        })

    
        res.redirect('/region')

    }catch(err){
        console.log(err)
    }
})

route.post('/admin/exelfile/add',protectedUser, protectedAdmin, upload.single('file'),async(req, res) => {
    try{

        const file = await ExelFile.find().lean()

        fs.unlink(path.join(__dirname, '../', 'utils', 'public', file[0] ? file[0].fileName : 'null'), (err) => { console.log(err) }); 
        fs.unlink(path.join(__dirname, '../', 'utils', 'public', file[0] ? file[0].fileNameExample : 'null'), (err) => { console.log(err) }); 

        await ExelFile.deleteMany()

        fs.copyFile(
            path.join(__dirname, '../', 'utils', 'public', 'upload', req.file.filename ), 
            path.join(__dirname, '../', 'utils', 'public', 'upload', 'exaple.xlsx' ), (err) => {
            if (err) throw err;
        });

        await ExelFile.create({
            fileName: '/upload/' + req.file.filename,
            fileNameExample: '/upload/exaple.xlsx'
        })

        req.session.fileName = req.file.filename
    
        res.redirect('/exelfile')

    }catch(err){
        console.log(err)
    }
})




module.exports = route