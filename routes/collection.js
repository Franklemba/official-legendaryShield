const express = require('express')
const router = express.Router()




/// main shopping page
router.get('/', (req, res) =>{
    res.render('category/collections') 
})  


module.exports = router  