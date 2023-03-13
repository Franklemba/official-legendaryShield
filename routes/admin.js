const express = require('express')
const router = express.Router()
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const imageMimeType = ['image/jpeg','image/png','image/gif','image/png','image/webp']





///create product
router.get('/', (req, res) =>{
    res.render('admin/uploadItem');
})  


module.exports = router
