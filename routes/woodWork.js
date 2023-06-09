const express = require("express");
const router = express.Router();
const Product = require("../models/uploadSchema");


// const woodItems = require("../public/js/woodItems");


router.get("/", async (req, res) => {
  const woodItems = await Product.find({category:'Woodwork Product'});
  res.render("collections/woodWork", { woodItems });
});


router.get("/:uniqueKey", async (req, res) => {
  const woodItem = await Product.findById(`${req.params.uniqueKey}`)


      res.render("collections/specificWood", { woodItem });
 
});



module.exports = router;
