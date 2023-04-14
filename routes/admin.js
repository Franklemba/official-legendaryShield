const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/uploadSchema"); ///imported it
// const BuyerDetails = require('../models/buyerSchema');
const { error } = require("console");
const uploadPath = path.join("public", Product.mainImgPath);
const ImagesPath = path.join("public", Product.imagesPath);
const imageMimeType = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/png",
  "image/webp",
];

const imagesUpload = multer({
  dest: ImagesPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

const multipleUploads = imagesUpload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

///create product
router.get("/", (req, res) => {
  res.render("admin/startOptions");
});

router.get("/uploadItem", (req, res) => {
  res.render("admin/uploadItem");
});

const customOrder = require("../models/customSchema");
const purchaseOrder = require("../models/purchaseSchema");

// purchaseOrder.deleteMany({})
//   .then(() => console.log('All items deleted'))
//   .catch(err => console.error(err));

router.get("/customOrders", async (req, res) => {
  try {
    const customOrders = await customOrder.find({});
    res.render("admin/customOrders", { customOrders });
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

router.post("/updateCustomOrder/:id/:state", async (req, res) => {
  console.log(req.params.state);
  customOrder.findOne({ _id: req.params.id }, function (err, order) {
    if (req.params.state == "read") {
      order.isRead = true;
      order.save(function (err, done) {
        res.redirect("/admin/customOrders");
      });
    }

    if (req.params.state == "unread") {
      order.isRead = false;
      order.save(function (err, done) {
        res.redirect("/admin/customOrders");
      });
    }
    if (req.params.state == "delete") {
      order.isDeleted = true;
      order.save(function (err, done) {
        res.redirect("/admin/customOrders");
      });
    }

    if (req.params.state == "restore") {
      order.isDeleted = false;
      order.save(function (err, done) {
        res.redirect("/admin/customOrders");
      });
    }

    if (req.params.state == "erase") {
      customOrder.findOneAndDelete({ _id: order._id }).then(() => {
        if (err) {
          console.log(err);
          return res.status(500).send();
        }
        res.redirect("/admin/customOrders");
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
    });
    // res.send(product);
  } catch {
    res.render("admin/studentPapers", {
      StudentPapers: student_Papers,
      message: "upload was unsuccessful",
      url: "/admin",
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
    console.log("product successfully updated");

    res.redirect("/admin/all");

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
router.get("/:id", async (req, res) => {
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

module.exports = router;
