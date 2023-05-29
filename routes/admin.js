const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/uploadSchema"); ///imported it
const News = require("../models/newsSchema")
const purchaseOrder = require("../models/purchaseSchema")
var ObjectId = require('mongodb').ObjectID;
// const BuyerDetails = require('../models/buyerSchema');
const { error } = require("console");

// News.deleteMany({}).then((done)=>{
//   console.log(done)
// })
const uploadPath = path.join("public", Product.mainImgPath);
const ImagesPath = path.join("public", Product.imagesPath);

const newsUploadPath = path.join("public", News.mainImgPath);
const newsImagesPath = path.join("public", News.imagesPath);

const imageMimeType = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/png",
  "image/webp",
];

const newsImagesUpload = multer({
  dest: newsImagesPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
})

const imagesUpload = multer({
  dest: ImagesPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

const newsUploads = newsImagesUpload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

const multipleUploads = imagesUpload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);


///create product

router.get("/", async(req, res) => {
  console.log(req.user)
  if(req.user.userName == 'LegendaryAdmin'){
    res.render("admin/adminOptions");
  }else{
    res.render("admin/designerOptions");
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


router.get("/orders", async (req, res) => {
  try {
    const purchaseOrders = await purchaseOrder.find({});
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
router.post("/", multipleUploads, async (req, res) => {
  //for saving the data to the database
  ///////////////////////////////////
  let photos = req.files;
  let images = photos.images;
  let mainImgName = photos.mainImg[0].filename;
  const imagesArray = [];

  images.forEach((data) => {
    imagesArray.push(data.filename);
  });

  const product = new Product({
    brandName: req.body.brandName,
    category: req.body.category,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    type: req.body.type,
    quantity: req.body.quantity,
    description: req.body.description,
    mainImg: mainImgName,
    images: imagesArray,
  });


  try {
    await product.save();
    console.log("product successfully saved");
    res.render("admin/uploadItem", {
      message: "product uploaded successfully",
      url: "/admin",
      transactionIdRequest:false
    });
    // res.send(product);
  } catch {
    res.render("admin/studentPapers", {
      StudentPapers: student_Papers,
      message: "upload was unsuccessful",
      url: "/admin",
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
    console.log(err);
  }
});

///// deleting selected product
router.post("/delete/:id", async (req, res) => {
  const id = req.body.id;

  const SelectedProduct = await Product.findById(`${id}`);
  const currentMainImg = SelectedProduct.mainImg;
  const currentImagesArray = SelectedProduct.images;
  try {
    await SelectedProduct.deleteOne({
      ///deletes selected item
      _id: `${id}`,
    });
    console.log("product successfully deleted");

    res.redirect("/admin/uploadItem");

    if (currentMainImg) {
      fs.unlink(path.join(ImagesPath, currentMainImg), (err) => {
        if (err) console.log(`error deleting main image`);
        else console.log(`main image deleted`);
      });

      currentImagesArray.forEach((image) => {
        fs.unlink(path.join(ImagesPath, image), (err) => {
          if (err) console.log("error deleting image");
          else console.log("images deleted");
        });
      });
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


//Upload news
router.get("/uploadNews", async (req, res) => {

  const news = await News.find({})
  res.render("admin/uploadNews", {
    newsItems:news
  });
  //    res.send(req.params.id)
});

router.post("/uploadNews", newsUploads,async (req, res) => {
  const { newsTitle,
  newsContent,
  mainImg, newsDate} = req.body;
  let photos = req.files;
  let images = photos.images;
  let mainImgName = photos.mainImg[0].filename;
  const imagesArray = [];

  images?.forEach((data) => {
    imagesArray.push(data.filename);
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

  const news = await News.deleteOne({_id:newsId})

  res.render("admin/uploadNews", {
    newsItems:[],
    message:'News Deleted',
    url:'/admin/uploadNews',
    transactionIdRequest:false
  });
  //    res.send(req.params.id)
});

module.exports = router;
