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


router.get('/:custom_Item', async (req,res)=>{
    const customItemName = req.params.custom_Item
    const CustomItem = await Product.find({customType:customItemName}).limit(1);
    
    res.render('collections/specificCustom', {
        customItem:CustomItem,
        message:null
    })
    // res.send(customItem);
    
})


module.exports = router;




