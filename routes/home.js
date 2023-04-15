const express = require("express");
const router = express.Router();
const customOrder = require('../models/customSchema')
const purchaseOrder = require("../models/purchaseSchema");
const Product = require("../models/uploadSchema");
const mongoose = require('mongoose')
router.get("/", (req, res) => {
  res.render("home/index");
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
    const customArray = ["wallets","flasks","phone pouches","diaries","special customization"];
    if(customArray.includes(keyword) == true){
        res.redirect("/custom")
    }else{
        res.redirect(`/store/${keyword}`)
    }
})

module.exports = router;
