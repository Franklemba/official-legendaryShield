const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const customOrder = require('../models/customSchema')
const purchaseOrder = require("../models/purchaseSchema");
const Product = require("../models/uploadSchema");
const mongoose = require('mongoose')
const CustomItems = require('../public/js/customItems');
const WoodItems = require('../public/js/woodItems');



router.get("/", async (req, res) => {
  const promoProducts = await Product.find({type:'promo'}).limit(4);
  const watchArray = [];
  const jeweryArray = [];

  // ----------- the wrist watch collection
  const menWatch = await Product.findOne({category:'Mens Watch'});
  if(menWatch) watchArray.push(menWatch);
  const womenWatch = await Product.findOne({category:'Women Watch'});
  if(womenWatch) watchArray.push(womenWatch);
  const uniWatch = await Product.findOne({category:'Unisex Watch'});
  if(uniWatch) watchArray.push(uniWatch);

  // ----------- the jewery collection
  const necklace = await Product.findOne({category:'Necklaces'});
  if(necklace) jeweryArray.push(necklace);
  const ring = await Product.findOne({category:'Rings'});
  if(ring) jeweryArray.push(ring);
  const bracelet = await Product.findOne({category:'Bracelet'});
  if(bracelet) jeweryArray.push(bracelet);


  

  // console.log(watchArray);
  try{
    res.render("home/index",{
        products: promoProducts, 
        customItems: CustomItems,
        woodItems: WoodItems,
        watchCollection: watchArray,
        jeweryCollection: jeweryArray
    });
  }catch(err){
    res.send("error fetching promo products")
  }
  // console.log(promoProducts);
  
});

router.get("/about", (req, res) => {
  res.render("home/about");
  // res.send('we run this shit')
});

router.get("/cart", (req, res) => {
  res.render("home/cart");
  // res.send('we run this shit')
});

router.get("/getItems/:list", async (req, res) => {
  const idList = req.params.list.split(",");
  const promises = [];
  console.log(idList);
  idList?.forEach((id) => {
    if (id != "" && id) {
      promises.push(Product.findById(id));
    }
  });
  const productList = await Promise.all(promises);
  res.json(productList);
});

router.post("/makeOrder", async (req, res) => {
  const { name, email, Pnumber, orderData } = req.body;
  console.log(orderData)
  const orderList = orderData.split(",");
  let orderArray = [];
  orderList.forEach((item) => {
    if (item != "") {
      orderArray.push({
        itemId: item.split(":")[0],
        quantity: item.split(":")[1],
      });
    }
  });

  const newOrder = new purchaseOrder({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    cart: orderArray,
    Pnumber,
  });

  newOrder
    .save()
    .then(() => {
      console.log("product successfully saved");
      res.render("home/index", {
        message: "Order Successfully Made, press cancel to return",
        url: "/",
      });
    })
    .catch((err) => {
      res.render("home/index", {
        message: "Something went wrong, press cancel to return",
        url: "/",
      });
      console.log(err);
    });
});

router.post("/customOrder/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  customOrder.findOne({_id:`${id}`})
    .then(order => {
      console.log('oder is'+order);
      res.json(order);
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post("/purchaseOrder/:id", async (req, res) => {
  const id = req.params.id;
console.log(id)
  purchaseOrder.findOne({_id:`${id}`})
    .then(order => {
      

      res.json(order);
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post('/search', (req,res)=>{
    let keyword = req.body.item;
    const customArray = ["photo stand","Flask","chopping board","crates","gift box","door signs","diary","note books","custom necklace","custom bracelet"];
    const woodWorkArray = ["wooden chop boards","wooden Photo frame","wooden coaster","wooden frame","wooden table"];
    if(customArray.includes(keyword) == true){
        res.redirect(`/custom/${keyword}`)
    }else if(woodWorkArray.includes(keyword) == true){
        res.redirect(`/woodwork/${keyword}`)
    }
    else{
        res.redirect(`/store/${keyword}`)
    }
})

module.exports = router;
