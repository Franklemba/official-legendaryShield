const express = require('express')
const router = express.Router()
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const woodProduct = require('../models/woodSchema'); 
const ImagesPath = path.join('public',woodProduct.woodImgPath);
const imageMimeType = ['image/jpeg','image/png','image/gif','image/png','image/webp']

const woodItems = require('../public/js/woodItems');


const mongoose = require('mongoose')
const imagesUpload = multer({
    dest:ImagesPath,
    fileFilter: (req, file, callback)=>{
        callback(null,imageMimeType.includes(file.mimetype))
    } 
})

const multipleUploads = imagesUpload.fields([{name:'images', maxCount:4}]);

router.get('/', (req,res)=>{
    res.render('collections/woodWork',{woodItems})
})



router.post('/',multipleUploads,async (req,res)=>{
    let photos = req.files
    let images = photos.images
    const imagesArray = [];
    
    images?.forEach(data=>{
        imagesArray.push(data.filename)
    })
    const woodOrder = new woodProduct({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        quantity: req.body.quantity,
        Pnumber: req.body.Pnumber,
        description: req.body.description,
        ImgLink: req.body.ImgLink,
        images: imagesArray,
    })

    try{
        await woodOrder.save();
        console.log('product successfully saved')
        res.render('collections/woodWork', {
            message: "request was successful, will get back to you shortly",
            url: "/woodWork",
        });
    }
    catch{
        res.render('collections/woodWork',{
            message: "Request was unsuccessful",
            url: "/woodWork"
        })
        console.log(err)    
    }
})


router.get('/:itemName', (req,res)=>{
    const woodItemName = req.params.itemName;
    woodItems.forEach(woodItem=>{
        if(woodItem.woodItem == woodItemName){
            res.render('collections/specificWood', {woodItem})
            return
        }
    })
})



module.exports = router;



