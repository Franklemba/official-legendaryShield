const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.send("this is what we do");
})



module.exports = router 