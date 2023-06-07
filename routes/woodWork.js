const express = require("express");
const router = express.Router();
const Product = require("../models/uploadSchema");


// const woodItems = require("../public/js/woodItems");


router.get("/", async (req, res) => {
  const woodItems = await Product.find({category:'Woodwork Product'});
  res.render("collections/woodWork", { woodItems });
});


router.get("/:itemName", async (req, res) => {
  const woodItemName = req.params.itemName;
  const woodItem = await Product.find({customType:woodItemName}).limit(1);

      res.render("collections/specificWood", { woodItem });
 
});



module.exports = router;
