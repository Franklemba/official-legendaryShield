const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const path = require("path");
const Product = require("../models/uploadSchema"); ///imported it
const News = require("../models/newsSchema");
const StartContent = require('../models/StartContentSchema')
const purchaseOrder = require("../models/purchaseSchema");


var ObjectId = require('mongodb').ObjectID;
const aws = require("aws-sdk");
const { error } = require("console");



// const uploadPath = path.join("public", Product.mainImgPath);
// const ImagesPath = path.join("public", Product.imagesPath);

// const newsUploadPath = path.join("public", News.mainImgPath);
// const newsImagesPath = path.join("public", News.imagesPath);

const imageMimeType = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/png",
  "image/webp",
];

aws.config.update({
  secretAccessKey:"DoZzXNIrsP4e4RFzt6np8/zmd5x02mqPcUYP11qA",
  accessKeyId:"AKIAWDHVUZREUENJ7RWN",
  region:"ap-south-1"
})


// aws.config.update({
//    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
//    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
//    region:process.env.AWS_REGION
// })

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    // bucket: process.env.AWS_BUCKET_NAME,
    bucket:"legendaryshield",
    s3:s3,
    acl:"public-read",
    key: (req,file,cb)=>{

      cb(null, "uploads/" + file.originalname);
    },
    fileFilter: (req, file, callback) => {
      callback(null, imageMimeType.includes(file.mimetype));
    }
  })
});


const multipleUploads = upload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);


///create product

router.get("/", async(req, res) => {
  console.log(req.user)
  if(req.user.userName == 'LegendaryAdmin'){
    res.render("admin/adminOptions");
  }else if(req.user.userName == 'LegendaryDesigner'){
    res.render("admin/designerOptions");
  }else{
    res.render("admin/secretaryOptions");
  }
});

router.get("/uploadItem", async(req, res) => {

  try{
    const products = await Product.find({});
    res.render("admin/uploadItem", {
      products
    });
  }
  catch{
res.redirect('/')
  }
});


router.get("/customOrders", async (req, res) => {
  try {
    const purchaseOrders = await purchaseOrder.find({});
    //console.log(purchaseOrders);
    const customOrders= []; 
    purchaseOrders.forEach(purchaseOrder=>{
      console.log(purchaseOrder)
      purchaseOrder.orderData.forEach(orderItem=>{
        if(orderItem.productType == 'custom'){
          customOrders.push(purchaseOrder)
          return
        }
      })
    })
    res.render("admin/customOrders", { purchaseOrders:customOrders });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/woodWorkOrders", async (req, res) => {
  try {
    const purchaseOrders = await purchaseOrder.find({});

       const woodOrders= []

    purchaseOrders.forEach(purchaseOrder=>{
      console.log(purchaseOrder)
      purchaseOrder.orderData.forEach(orderItem=>{
        if(orderItem.productType == 'wood'){
          woodOrders.push(purchaseOrder)
          return
        }
      })
    })
    res.render("admin/woodOrders", { purchaseOrders:woodOrders });
  } catch (err) {
    res.status(500).send(err);
  }
});
// purchaseOrder.deleteMany({}).then((done)=>{
//   console.log(done);
// });

router.get("/orders", async (req, res) => {
  try {
    const purchaseOrders = await purchaseOrder.find({}).sort({purchasedAt:-1});
    console.log(purchaseOrders);
    
    res.render("admin/orders", { purchaseOrders });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/updatePurchaseOrder/:id/:state", async (req, res) => {
  console.log(req.params.state);
  purchaseOrder.findOne({ _id: req.params.id }, function (err, order) {
    if (req.params.state == "read") {
      order.isRead = true;
      order.save(function (err, done) {
        res.redirect("/admin/orders");
      });
    }

    if (req.params.state == "unread") {
      console.log("sas");
      order.isRead = false;
      order.save(function (err, done) {
        res.redirect("/admin/orders");
      });
    }
    if (req.params.state == "delete") {
      order.isDeleted = true;
      order.save(function (err, done) {
        res.redirect("/admin/orders");
      });
    }

    if (req.params.state == "restore") {
      order.isDeleted = false;
      order.save(function (err, done) {
        res.redirect("/admin/orders");
      });
    }

    if (req.params.state == "erase") {
      purchaseOrder.findOneAndDelete({ _id: order._id }).then(() => {
        if (err) {
          console.log(err);
          return res.status(500).send();
        }
        res.redirect("/admin/orders");
      });
    }
  });
});



///uploading  product
// router.post("/", (req,res)=>{
//   res.send(req.body)
// })
router.post("/", multipleUploads, async (req, res) => {
  //for saving the data to the database
  ///////////////////////////////////
  let photos = req.files;
  let images = photos.images;
  let mainImgName = photos.mainImg[0].originalname;
  const imagesArray = [];
  const allProducts = await Product.find();
  console.log(photos);

  images.forEach((data) => {
    imagesArray.push(data.originalname);
  });

  const product = new Product({
    brandName: req.body.brandName,
    category: req.body.category,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    type: req.body.type,
    quantity: req.body.quantity,
    description: req.body.description,
    customType:req.body.customType,
    mainImg: mainImgName,
    images: imagesArray,
  });


  try {
    await product.save();
    console.log("product successfully saved");
    res.render("admin/uploadItem", {
      products: allProducts,
      message: "product uploaded successfully",
      url: "/admin/uploadItem",
      transactionIdRequest:false
    });
    // res.send(product);
  } catch (err){
    res.render("admin/uploadItem", {
      products: allProducts,
      message: "upload was unsuccessful",
      url: "/admin/uploadItem",
      transactionIdRequest:false
    });
    console.log(err);
  }
});

///viewing all uploaded products
router.get("/all", async (req, res) => {
  const product = await Product.find();

  try {
    res.render("admin/allItems", {
      products: product,
    });
  } catch (err) {
    res.render("admin/uploadItem");
    console.error();
  }
});


  async function deleteImages(item){
      await s3.deleteObject({
      //  Bucket: process.env.AWS_BUCKET_NAME,
      Bucket:"legendaryshield",
       Key: `uploads/${item}`
      }).promise();
    }
///// deleting selected product
router.post("/delete/:id", async (req, res) => {

  const id = req.body.id;
  const SelectedProduct = await Product.findById(`${id}`);
  const currentMainImg = SelectedProduct.mainImg;
  const currentImagesArray = SelectedProduct.images;
  currentImagesArray.push(currentMainImg);

  try {
    await SelectedProduct.deleteOne({
      ///deletes selected item
      _id: `${id}`,
    });
    console.log("product successfully deleted");
    res.redirect("/admin/uploadItem");
    
    if (currentMainImg) {

      currentImagesArray.forEach((image)=>{
        deleteImages(image)
      })
      
    }
  } catch {
    res.send("error deleting product");
    console.error();
  }
});


///selecting item for update
router.get("/getProduct/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(`${id}`);
  try {
    res.render("admin/productUpdate", {
      product: product,
    });
  } catch {
    res.send("error accessing product");
  }
  //    res.send(req.params.id)
});




//News Routes

router.get("/uploadNews", async (req, res) => {

  const news = await News.find({});

  res.render("admin/uploadNews", {
    newsItems:news
  });

  //    res.send(req.params.id)
});

router.post("/updateQty/:buttonId/:quantity", async(req, res) => {
  const buttonId  = req.params.buttonId;
  const quantity = req.params.quantity;

  console.log(buttonId+'ds'+ quantity);
  //    res.send(req.params.id)

  const SelectedProduct = await Product.findById(`${buttonId}`);
 
  const newQuantity = SelectedProduct.quantity - quantity;
 
 SelectedProduct.updateOne({quantity:newQuantity})
 .then((done)=>{
    console.log(done)
  }).catch((err)=>{
    console.log(err)
  })
});

router.post("/uploadNews", multipleUploads,async (req, res) => {
  const { newsTitle,
  newsContent,
  mainImg, newsDate} = req.body;
  let photos = req.files;
  let images = photos.images;
  let mainImgName = photos.mainImg[0].originalname;
  const imagesArray = [];

  images?.forEach((data) => {
    imagesArray.push(data.originalname);
  });
  console.log(req.body);


  const newsItem = new News({
    newsTitle,
    date:newsDate,
    mainImg:mainImgName,
    images:imagesArray,
    newsContent
  })

  try{
    await newsItem.save();
    res.render("admin/adminOptions", {
      message: "News Uploaded successfully",
      url: '/admin/uploadNews',
      transactionIdRequest:false
    });
  }
  catch{
    res.send('something went wrong')
  }
});


router.post("/deleteNews", async (req, res) => {
  const {newsId} = req.body;
  const id = req.body.newsId;
  const SelectedProduct = await News.findById(`${id}`);
  const currentMainImg = SelectedProduct.mainImg;
  const currentImagesArray = SelectedProduct.images;
  currentImagesArray.push(currentMainImg);
  console.log(id);
  const news = await News.deleteOne({_id:newsId})
  if (currentMainImg) {
    currentImagesArray.forEach((image)=>{
      deleteImages(image)
    })
    
  }
  res.render("admin/uploadNews", {
    newsItems:[],
    message:'News Deleted',
    url:'/admin/uploadNews',
    transactionIdRequest:false
  });
  //    res.send(req.params.id)
});


//start content routes

router.get("/uploadStartContent", async (req, res) => {

  const startContent = await StartContent.find({})
  console.log(startContent)
  res.render("admin/uploadStartContent", {
    startContent:startContent
  });
  //    res.send(req.params.id)
});

router.post("/uploadStartContent", multipleUploads,async (req, res) => {
  const { startContent} = req.body;
  let photos = req.files;
  let images = photos.images;
  let mainImgName = photos.mainImg[0].originalname;
  
  console.log(req.body);

  const startItem = new StartContent({
    startContent:startContent,
    mainImg:mainImgName,
  })

  try{
    await startItem.save();
    res.render("admin/adminOptions", {
      message: "Home Page Content Uploaded successfully",
      url: '/admin/uploadStartContent',
      transactionIdRequest:false
    });
  }
  catch{
    res.send('something went wrong')
  }
});

router.post("/deleteStartItem", async (req, res) => {
  const {startItemId} = req.body;
  const id = startItemId;
  const SelectedProduct = await StartContent.findById(`${id}`);
  const currentMainImg = SelectedProduct.mainImg;
 
  console.log(id);
  const item = await StartContent.deleteOne({_id:id})
  if (currentMainImg) {
      deleteImages([currentMainImg])
  }
  res.render("admin/uploadStartContent", {
    newsItems:[],
    message:'Home Page Content Deleted',
    url:'/admin/uploadStartContent',
    transactionIdRequest:false,
    startContent:[]
  });
  //    res.send(req.params.id)
});

module.exports = router;




