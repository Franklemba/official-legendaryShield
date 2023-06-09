const express = require('express')
const router = express.Router()
const Product = require("../models/uploadSchema");


router.get('/', async (req,res)=>{
    const CustomItems = await Product.find({category:'Custom Product'});
    res.render('collections/custom',{
        customItems:CustomItems, 
        message:null
   })
})


router.get('/:uniqueKey', async (req,res)=>{
    const CustomItem = await Product.findById(`${req.params.uniqueKey}`)
    
    res.render('collections/specificCustom', {
        customItem:CustomItem,
        message:null
    })
    // res.send(customItem);
    
})


module.exports = router;




