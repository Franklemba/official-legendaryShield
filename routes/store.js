const express = require('express')
const router = express.Router()
const Product = require('../models/uploadSchema')   ///imported it



/// main shopping page
router.get('/', (req, res) =>{
    res.redirect('/');
})  


///after the main shopping page
router.get('/:categoryName', async (req,res)=>{

    let stripedCategoryName = req.params.categoryName;
 

    const product = await Product.find({
                category: stripedCategoryName
    });

    try{
        if(product != ''){
            res.render('collections/specificProduct',{
                productName: stripedCategoryName,
                products: product
            })
        }else{
            res.send('this category is not yet uploaded');
        }
    }
    catch{
        res.send('error accessing database')
    }
})

/////page displays all details of particular selected product
router.get('/item/:uniqueKey',async (req,res)=>{

    const product = await Product.findById(`${req.params.uniqueKey}`)
    try{
        res.render('collections/productDetails',{
            product:product
         })
        //  console.log(req.params.uniqueKey)
    }
    catch{
        res.send('an error has occurred ')
    }
    
})



module.exports = router 

