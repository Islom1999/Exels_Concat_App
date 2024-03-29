const multer = require('multer')
const path = require('path')

// set storage
const storage = multer.diskStorage({
    destination: 'utils/public/upload/',
    filename: function(req, file, cb){
        cb(null, file.fieldname  + '-' + Date.now() + path.extname(file.originalname))
    }
})

// initilee upload
const upload = multer({
    storage,
    limits: {fileSize: 50000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
})

// check file image
	function checkFileType(file, cb){
	    const fileTypes = /xlsx/

	    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
	    // const mimetype = fileTypes.test(file.mimetype)
	    const mimetype = true

	    if(mimetype && extname){
	        return cb(null, true)
	    }else{
	        cb('Error: You can only upload image files')
	    }
	}

module.exports = upload 