const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const purchaseOrder = require("../models/purchaseSchema");
const Product = require("../models/uploadSchema");
const News = require("../models/newsSchema");

const mongoose = require('mongoose')
const CustomItems = require('../public/js/customItems');
const WoodItems = require('../public/js/woodItems');

const multer = require("multer");

const imagesPath = path.join("public", purchaseOrder.purchaseImgPath);
const imageMimeType = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/png",
  "image/webp",
];


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

  const news = await News.find({})
  console.log(news)
  

  // console.log(watchArray);
  try{
    res.render("home/index",{
        products: promoProducts, 
        customItems: CustomItems,
        woodItems: WoodItems,
        watchCollection: watchArray,
        jeweryCollection: jeweryArray,
        newsItems:news,
        message:null
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
  res.render("home/cart",{
    imgUrl:"",
    message: null,
    url:"",
    transactionIdRequest:false
  });
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

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// orderData.forEach(orderItem=>{
//   orderString+=`${orderItem.itemName} - K200, <br>`
// })
// console.log(orderString)


router.post("/makeOrder", async (req, res) => {
  const { name, email, Pnumber, orderData } = req.body;
  //console.log(email)
  const orderList = orderData.split("+");
  let orderArray = [];
  let toEmailString = ''

orderList.forEach((orderItem)=>{
  if(orderItem){
    const o = JSON.parse(orderItem)
    console.log(o)
    orderArray.push(JSON.parse(orderItem))
    toEmailString+=`<li>${o.itemName} - K${o.itemPrice}</li>`
  }
})
console.log(toEmailString)
  let orderString = ''
  new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
    "sender":{ "email":"chisalecharles23@gmail.com", "name":"Sendinblue"},
    "subject":"Legendary Shield",
    "htmlContent":
    `<html>
    <head></head>
    <body>Legendary Shield</body>
    </html>
    `,
    "messageVersions":[
      //Definition for Message Version 1 
      {
          "to":[
             {
                "email":email,
                "name":name,
             }
          ],
          "htmlContent": generateUserEmail(name,toEmailString)
          ,
          "subject":"Order Recieved!~Legendary Shield"
        },
      ]
      //"htmlCont,ent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"
    }).then(function(data) {
 //console.log(data);
}, function(error) {
 console.error(error);
});

  const news = await News.find({});

orderList.forEach((orderItem)=>{
  if(orderItem){
    orderArray.push(JSON.parse(orderItem))
  }
})


  const newOrder = new purchaseOrder({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    orderData:orderArray,
    Pnumber,
  });
  newOrder
    .save()
    .then((purchaseItem) => {
      console.log("product successfully saved----");
      console.log(purchaseItem)
      console.log('-----')
      res.render("home/index", {
        message: "Order Successfully Made, Enter Transaction Id to confirm payment",
        txnUrl: `/confirmTransaction/${purchaseItem._id}`,
        url:'/',
        transactionIdRequest:true,
        products:[],
        jeweryCollection:[],
        customItems:[],
        woodItems:[],
        watchCollection:[],
        newsItems:news
      });
    })
    .catch((err) => {
      res.render("home/index", {
         message: "Something went wrong, press cancel to return",
        url: "_id",
        transactionIdRequest:false
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

const imagesUpload = multer({
  dest: imagesPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

const imageUpload = imagesUpload.fields([
  { name: "sampleImage", maxCount: 1 },
]);

router.post("/cartWithImage", imageUpload, async(req, res) => {
  //const imgName = req;
  let photos=''
  let imageName='' 
  if(req.files){
    photos = req.files;
    let images = photos.images;
    imageName = req.files.sampleImage[0].filename;
    console.log(imageName);
  }
  // res.send(imageName);
  res.render('home/cart', {imgUrl:imageName})
});



router.post('/confirmTransaction/:orderId',(req, res)=>{
  const {orderId } = req.params;
  const {transactionId} = req.body;
  purchaseOrder.updateOne({_id:orderId},{transactionId:transactionId}).then((result)=>{
    console.log(result)
    res.redirect('/')
  })
  
  // console.log(orderId)
  // console.log(transactionId)
})



function generateUserEmail(name, cartString) {
  return `<html>
    <head>
      <style>
        /* Inline CSS */
        body {
          background-color: #f5f5f5;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
    
        .black-box {
          background-color: #000000;
          color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          margin-top: 30px;
        }
        h1 {
          color: #000000;
          font-size: 32px;
          margin: 0;
          margin-top: 20px;
        }
        h2 {
          color: #ffffff;
          font-size: 24px;
          margin: 5px 0;
        }
        h3{
          color: #ffffff;
          font-size: 20px;
        }
        strong {
          font-weight: bold;
        }
        ul {
          list-style-type: none;
          padding: 0;
          text-align: left;
          margin-left: 0;
        }
        li {
          margin-bottom: 10px;
        }
        img {
          max-width: 100px;
          display: block;
          margin: 0 auto;
          margin-top: 20px;
        }
        .company-name {
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
        }

        .align{
          display:flex;
          flex-direction:row;
          justify-content:center;
          align-items:center;
          gap:30px;
        }
        .hh1{
          margin:0;
          padding:0;
          text-align:center;
          color:black;
        }
      </style>
    </head>
    <body>
        <h1>Hello ${name},</h1>
        <div class="black-box">
        <h2>We have received your order for the items,</h2>
        <ul>
        ${cartString}
        </ul>
        <br>
        <h3>Thank you for shopping with us.</h3>
        </div>
        <img src="https://istude.s3.ap-south-1.amazonaws.com/legendaryShield/images/lsiLogo.png" alt="Legendary Shield" class="logo">
        <div class="company-name">Legendary Shield</div>
      
    </body>
  </html>`;
}



function sendEmailToAdmin(){

}

module.exports = router;
