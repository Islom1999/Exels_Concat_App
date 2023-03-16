 
const protectedUser = (req,res,next) => {
    if(!(req.session.isLogin)){
        return res.redirect("/login")
    }
    next()
}

const protectedAdmin = (req,res,next) => {
    if(!(req.session.isAdmin && req.session.isLogin)){
        return res.redirect("/admin/login")
    }
    next()
}

const guest = (req,res,next) => {
    if(req.session.isAdmin && req.session.isLogin){
        return res.redirect("/admin/home")
    }
    next()
}

const fullAdmin = (req,res,next) => {
    if(!(req.session.isAdmin && req.session.isLogin && req.session.status == 'fullAdmin')){
        return res.redirect("/")
    }
    next()
}

module.exports = {protectedUser, protectedAdmin, guest, fullAdmin}