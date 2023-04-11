const express = require('express')
const router = express.Router()
const purchaseOrder = require('../models/purchaseSchema');
const Product = require('../models/uploadSchema')

router.get('/', (req,res)=>{
    res.render('home/index')
})

router.get('/about', (req, res) => {
    res.render('home/about')
    // res.send('we run this shit')
})

router.get('/cart', (req, res) => {
    res.render('home/cart')
    // res.send('we run this shit')
})

router.get('/getItems/:list', async (req, res) => {
    const idList = req.params.list.split(',')
    const promises = [];
    console.log(idList)
    idList.forEach(id => {
      if (id != '') {
        promises.push(Product.findById(id));
      }
    });
    const productList = await Promise.all(promises);
    res.json(productList);
  });
  



router.post('/buy/:id', async(req,res)=>{
    const productId = req.params.id;
    const {name, email, Pnumber} = req.body;
    
    const newOrder = new purchaseOrder({
        name,
        email,
        cart:[{productId, quantity:1}],
        Pnumber,
        totalPrice:100,
    })
    try{
        await newOrder.save();
        console.log('product successfully saved')
        res.render('home/index', {
            message: "Order Successfully Made, press cancel to return",
            url: "/",
        });
    }
    catch{
        res.render('home/index', {
            message: "Something went wrong, press cancel to return",
            url: "/",
        });
        console.log(err)    
    } 
})


module.exports = router;



