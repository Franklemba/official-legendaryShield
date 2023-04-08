const express = require('express')
const router = express.Router()
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const customProduct = require('../models/customSchema'); 
const ImagesPath = path.join('public',customProduct.customImgPath);
const imageMimeType = ['image/jpeg','image/png','image/gif','image/png','image/webp']


const imagesUpload = multer({
    dest:ImagesPath,
    fileFilter: (req, file, callback)=>{
        callback(null,imageMimeType.includes(file.mimetype))
    } 
})
const multipleUploads = imagesUpload.fields([{name:'images', maxCount:4}]);
router.get('/', (req,res)=>{
    res.render('collections/custom')
})

router.post('/',multipleUploads,async (req,res)=>{
    let photos = req.files
    let images = photos.images
    const imagesArray = [];
    
    images.forEach(data=>{
        imagesArray.push(data.filename)
    })

    const cProduct = new customProduct({
        name: req.body.name,
        email: req.body.email,
        quantity: req.body.quantity,
        Pnumber: req.body.Pnumber,
        description: req.body.description,
        ImgLink: req.body.ImgLink,
        images: imagesArray
    })

    try{
        await cProduct.save();
        console.log('product successfully saved')
        res.render('collections/custom', {
            message: "request was successful, will get back to you shortly",
            url: "/custom",
        });
    }
    catch{
        res.render('collections/custom',{
            message: "request was unsuccessful",
            url: "/custom"
        })
        console.log(err)    
    }
})


module.exports = router;



