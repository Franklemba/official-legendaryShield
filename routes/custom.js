const express = require('express')
const router = express.Router()


const customItems = require('../public/js/customItems');

// console.log(customItems)


router.get('/', (req,res)=>{
    res.render('collections/custom',{customItems, message:null})
})


router.get('/:customItem',(req,res)=>{
    const customItemName = req.params.customItem
    customItems.forEach(customItem=>{
        if(customItem.customName == customItemName){
            res.render('collections/specificCustom', {customItem, message:null})
            return
        }
    })
    
})


module.exports = router;




