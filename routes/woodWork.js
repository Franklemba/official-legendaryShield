const express = require("express");
const router = express.Router();


const woodItems = require("../public/js/woodItems");


router.get("/", (req, res) => {
  res.render("collections/woodWork", { woodItems });
});


router.get("/:itemName", (req, res) => {
  const woodItemName = req.params.itemName;
  woodItems.forEach((woodItem) => {
    if (woodItem.woodItem == woodItemName) {
      res.render("collections/specificWood", { woodItem });
      return;
    }
  });
});



module.exports = router;
