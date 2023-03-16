const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const ExelFile = require('../model/exelFile')

const exelAdd = async( file ) => {
    try{
        const fileExel = await ExelFile.find().lean()
        const fileName = fileExel[0].fileName

        const workbook1 = XLSX.readFile(path.join(__dirname, 'public', fileName));
        const workbook2 = XLSX.readFile(path.join(__dirname, 'public',  file));
        
        const sheet1Name = workbook1.SheetNames[0];
        const sheet2Name = workbook2.SheetNames[0];
        
        const worksheet1 = workbook1.Sheets[sheet1Name];
        const worksheet2 = workbook2.Sheets[sheet2Name];
        
        const data = XLSX.utils.sheet_to_json(worksheet1).concat(XLSX.utils.sheet_to_json(worksheet2))
        
        const combinedWorksheet = XLSX.utils.sheet_add_json(worksheet1, data);
        
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, combinedWorksheet, 'exelAll');
        XLSX.writeFile(newWorkbook, path.join(__dirname, 'public',  fileName));
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    exelAdd
}

